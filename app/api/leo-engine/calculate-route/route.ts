import { NextRequest, NextResponse } from "next/server";
import { calculateRoute } from "@/lib/leo-engine";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/leo-engine/calculate-route
 * Body: { courierId, routeId, packageIds, startLat, startLng }
 * 
 * Triggers full route optimization using Mapbox Matrix API.
 * Updates all package windows in DB and emits Realtime events.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { courierId, routeId, packageIds, startLat, startLng } = body;

        if (!courierId || !routeId || !packageIds?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await calculateRoute({
            courierId,
            routeId,
            packageIds,
            startLat: startLat ?? 52.2297,
            startLng: startLng ?? 21.0122,
            mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
        });

        // Mark route as active
        await supabaseAdmin
            .from("routes")
            .update({ status: "active", actual_start_time: new Date().toISOString() })
            .eq("id", routeId);

        return NextResponse.json({
            success: true,
            orderedPackageIds: result.orderedPackageIds,
            totalDistanceKm: result.totalDistanceKm,
            totalDurationMinutes: result.totalDurationMinutes,
            windowCount: result.windows.length
        });
    } catch (err: any) {
        console.error("[LEO Engine] calculate-route error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
