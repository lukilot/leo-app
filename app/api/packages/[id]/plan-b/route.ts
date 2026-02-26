import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * POST /api/packages/[id]/plan-b
 * Activates a Plan B option for a package.
 * Can be triggered by customer (preference change) or courier (exception).
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const body = await req.json();
        const { planB, meta, triggeredBy, courierId } = body;
        // triggeredBy: 'customer' | 'courier' | 'system'

        const validOptions = ["door", "neighbor", "locker", "pudo", "delay", "return"];
        if (!validOptions.includes(planB)) {
            return NextResponse.json({ error: "Invalid Plan B option" }, { status: 400 });
        }

        // 1. Update package
        await supabase
            .from("packages")
            .update({
                current_plan_b: planB,
                is_plan_b_active: true,
                plan_b_triggered_at: new Date().toISOString(),
                status: "plan_b_active",
                updated_at: new Date().toISOString()
            })
            .eq("id", id);

        // 2. Emit plan_b_triggered event
        await supabase.from("package_events").insert({
            package_id: id,
            courier_id: courierId ?? null,
            event_type: "plan_b_triggered",
            payload: {
                plan_b: planB,
                meta: meta ?? {},
                triggered_by: triggeredBy ?? "customer",
                triggered_at: new Date().toISOString()
            }
        });

        return NextResponse.json({ success: true, planB });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
