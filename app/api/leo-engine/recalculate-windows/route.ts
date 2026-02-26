import { NextRequest, NextResponse } from "next/server";
import { recalculateWindowsAfterDelay } from "@/lib/leo-engine";

/**
 * POST /api/leo-engine/recalculate-windows
 * Body: { courierId, routeId, currentPackageSequence, delayMinutes }
 * 
 * Called when a courier is delayed. Cascades the delay to all subsequent stops.
 * Emits window_recalculated events → Supabase Realtime → Customer push notifications.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { courierId, routeId, currentPackageSequence, delayMinutes } = body;

        if (!courierId || !routeId || delayMinutes === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await recalculateWindowsAfterDelay(
            courierId,
            routeId,
            currentPackageSequence ?? 0,
            delayMinutes
        );

        return NextResponse.json({
            success: true,
            message: `Windows recalculated: +${delayMinutes} min delay propagated`
        });
    } catch (err: any) {
        console.error("[LEO Engine] recalculate-windows error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
