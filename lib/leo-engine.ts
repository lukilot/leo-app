import { supabase } from "@/lib/supabaseClient";

interface CalculateRouteInput {
    courierId: string;
    routeId: string;
    packageIds: string[];
    startLat: number;
    startLng: number;
    mapboxToken: string;
}

interface Stop {
    packageId: string;
    lat: number;
    lng: number;
    address: string;
}

interface RouteResult {
    orderedPackageIds: string[];
    windows: Array<{
        packageId: string;
        windowStart: Date;
        windowEnd: Date;
        sequenceNumber: number;
        estimatedMinutes: number;
    }>;
    totalDistanceKm: number;
    totalDurationMinutes: number;
}

/**
 * LEO Engine: Calculate optimized delivery route using Mapbox Matrix API.
 * 1. Fetch all package coordinates for the route
 * 2. Build Mapbox Matrix request (travel time between all stops)
 * 3. Apply nearest-neighbor greedy optimization
 * 4. Calculate 15-minute windows based on sequence
 * 5. Persist to database and emit window_recalculated events
 */
export async function calculateRoute(input: CalculateRouteInput): Promise<RouteResult> {
    const { courierId, routeId, packageIds, startLat, startLng, mapboxToken } = input;

    // 1. Fetch package coordinates
    const { data: packages, error } = await supabase
        .from("packages")
        .select("id, geo_lat, geo_lng, recipient_address")
        .in("id", packageIds)
        .not("geo_lat", "is", null);

    if (error || !packages || packages.length === 0) {
        throw new Error(`Failed to fetch packages: ${error?.message}`);
    }

    const validPackages = packages.filter(p => p.geo_lat && p.geo_lng);

    // 2. Build coordinate list (courier start + all stops)
    const coords = [
        [startLng, startLat], // Driver's current position
        ...validPackages.map(p => [p.geo_lng!, p.geo_lat!])
    ];

    // 3. Mapbox Matrix API call (duration in seconds between all points)
    let durations: number[][] = [];

    try {
        const coordStr = coords.map(c => c.join(",")).join(";");
        const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordStr}?annotations=duration&access_token=${mapboxToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.durations) {
            durations = data.durations;
        }
    } catch (err) {
        console.warn("Mapbox Matrix API failed, using straight-line estimation", err);
        // Fallback: estimate 2min per km using Haversine
        durations = buildFallbackMatrix(coords);
    }

    // 4. Nearest-neighbor greedy optimization
    const n = validPackages.length;
    const visited = new Array(n).fill(false);
    const order: number[] = [];
    let current = 0; // Start from courier position (index 0)

    for (let step = 0; step < n; step++) {
        let nearest = -1;
        let minTime = Infinity;

        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                const time = durations[current]?.[i + 1] ?? Infinity; // +1 because index 0 is courier start
                if (time < minTime) {
                    minTime = time;
                    nearest = i;
                }
            }
        }

        if (nearest !== -1) {
            visited[nearest] = true;
            order.push(nearest);
            current = nearest + 1;
        }
    }

    // 5. Calculate 15-minute delivery windows
    const ATT_START = new Date();
    ATT_START.setMinutes(ATT_START.getMinutes() + 30); // First delivery min 30min from now
    ATT_START.setSeconds(0, 0);

    let cumulativeMinutes = 0;
    const windows: RouteResult["windows"] = [];
    let totalDistance = 0;

    order.forEach((pkgIndex, seqNum) => {
        const pkg = validPackages[pkgIndex];
        const travelSeconds = durations[seqNum === 0 ? 0 : order[seqNum - 1] + 1]?.[pkgIndex + 1] ?? 600;
        const travelMinutes = Math.ceil(travelSeconds / 60);
        const atDoorMinutes = 2; // Average at-door handling

        cumulativeMinutes += travelMinutes;

        const windowStart = new Date(ATT_START);
        windowStart.setMinutes(windowStart.getMinutes() + cumulativeMinutes);
        // Snap to 5-minute boundaries for cleaner UX
        windowStart.setMinutes(Math.ceil(windowStart.getMinutes() / 5) * 5, 0, 0);

        const windowEnd = new Date(windowStart);
        windowEnd.setMinutes(windowEnd.getMinutes() + 15);

        windows.push({
            packageId: pkg.id,
            windowStart,
            windowEnd,
            sequenceNumber: seqNum + 1,
            estimatedMinutes: cumulativeMinutes
        });

        cumulativeMinutes += atDoorMinutes;
        totalDistance += (travelMinutes / 60) * 30; // Rough: 30 km/h urban average
    });

    const orderedPackageIds = order.map(i => validPackages[i].id);
    const totalDurationMinutes = windows[windows.length - 1]?.estimatedMinutes ?? 0;

    // 6. Persist to database
    await persistRouteResult({
        routeId,
        courierId,
        orderedPackageIds,
        windows,
        totalDistanceKm: totalDistance,
        totalDurationMinutes
    });

    return {
        orderedPackageIds,
        windows,
        totalDistanceKm: totalDistance,
        totalDurationMinutes
    };
}

async function persistRouteResult(data: {
    routeId: string;
    courierId: string;
    orderedPackageIds: string[];
    windows: RouteResult["windows"];
    totalDistanceKm: number;
    totalDurationMinutes: number;
}) {
    // Update route
    await supabase
        .from("routes")
        .update({
            ordered_package_ids: data.orderedPackageIds,
            total_distance_km: data.totalDistanceKm,
            estimated_duration_minutes: data.totalDurationMinutes,
            last_recalculated_at: new Date().toISOString()
        })
        .eq("id", data.routeId);

    // Update each package's window and sequence
    await Promise.all(
        data.windows.map(w =>
            supabase
                .from("packages")
                .update({
                    window_start: w.windowStart.toISOString(),
                    window_end: w.windowEnd.toISOString(),
                    sequence_number: w.sequenceNumber,
                    updated_at: new Date().toISOString()
                })
                .eq("id", w.packageId)
        )
    );

    // Emit window_recalculated events (triggers Supabase Realtime → Customer push)
    await supabase.from("package_events").insert(
        data.windows.map(w => ({
            package_id: w.packageId,
            courier_id: data.courierId,
            event_type: "window_recalculated",
            payload: {
                new_window_start: w.windowStart.toISOString(),
                new_window_end: w.windowEnd.toISOString(),
                sequence_number: w.sequenceNumber
            }
        }))
    );
}

/**
 * Recalculate windows for remaining packages after a delay event.
 * Called whenever a courier marks a stop as delayed or a traffic event occurs.
 */
export async function recalculateWindowsAfterDelay(
    courierId: string,
    routeId: string,
    currentPackageSequence: number,
    delayMinutes: number
): Promise<void> {
    // Fetch all remaining packages in sequence
    const { data: packages } = await supabase
        .from("packages")
        .select("id, window_start, window_end, sequence_number")
        .eq("route_id", routeId)
        .gt("sequence_number", currentPackageSequence)
        .order("sequence_number");

    if (!packages || packages.length === 0) return;

    // Shift all subsequent windows by delayMinutes
    const updates = packages.map(pkg => {
        const newStart = new Date(pkg.window_start);
        const newEnd = new Date(pkg.window_end);
        newStart.setMinutes(newStart.getMinutes() + delayMinutes);
        newEnd.setMinutes(newEnd.getMinutes() + delayMinutes);

        return {
            id: pkg.id,
            window_start: newStart.toISOString(),
            window_end: newEnd.toISOString(),
            current_delay_minutes: delayMinutes
        };
    });

    // Batch update
    await Promise.all(
        updates.map(u =>
            supabase.from("packages").update({
                window_start: u.window_start,
                window_end: u.window_end,
                current_delay_minutes: u.current_delay_minutes
            }).eq("id", u.id)
        )
    );

    // Emit recalculation events
    await supabase.from("package_events").insert(
        packages.map((pkg, i) => ({
            package_id: pkg.id,
            courier_id: courierId,
            event_type: "window_recalculated",
            payload: {
                new_window_start: updates[i].window_start,
                new_window_end: updates[i].window_end,
                delay_minutes: delayMinutes,
                reason: "upstream_delay"
            }
        }))
    );
}

// Haversine distance in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildFallbackMatrix(coords: number[][]): number[][] {
    return coords.map(c1 =>
        coords.map(c2 => {
            const dist = haversine(c1[1], c1[0], c2[1], c2[0]);
            return (dist / 30) * 3600; // 30 km/h → seconds
        })
    );
}
