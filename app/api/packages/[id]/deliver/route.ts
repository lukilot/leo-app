import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * POST /api/packages/[id]/deliver
 * Marks a package as delivered and emits the delivered event.
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const body = await req.json();
        const { courierId, lat, lng, signatureUrl, photoUrl } = body;

        // 1. Update package status
        const { error: pkgError } = await supabase
            .from("packages")
            .update({
                status: "delivered",
                sub_status: "Dostarczona pomyślnie",
                updated_at: new Date().toISOString()
            })
            .eq("id", id);

        if (pkgError) throw pkgError;

        // 2. Emit delivered event (triggers Realtime → customer notification)
        await supabase.from("package_events").insert({
            package_id: id,
            courier_id: courierId,
            event_type: "delivered",
            payload: {
                location: { lat, lng },
                signature_url: signatureUrl ?? null,
                photo_url: photoUrl ?? null,
                delivered_at: new Date().toISOString()
            }
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
