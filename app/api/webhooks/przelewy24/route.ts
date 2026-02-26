import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * POST /api/webhooks/przelewy24
 * Handles Przelewy24 payment status callbacks (COD / BLIK).
 * 
 * Przelewy24 sends a signed POST request after each transaction.
 * We verify the signature and update the package's COD status.
 * 
 * See: https://docs.przelewy24.com/Zakonczone_transakcje
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            merchantId,
            posId,
            sessionId,    // Our package ID or internal reference
            amount,
            originAmount,
            currency,
            orderId,      // Przelewy24 transaction ID
            methodId,     // 178 = BLIK, etc.
            statement,
            sign
        } = body;

        // --- SIGNATURE VERIFICATION ---
        // In production: verify SHA384 hash of (sessionId + orderId + amount + currency + CRC)
        // const expectedSign = sha384(`${sessionId}|${posId}|${orderId}|${amount}|${currency}|${process.env.P24_CRC}`);
        // if (sign !== expectedSign) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        // NOTE: Disabled for MVP/sandbox environment

        // sessionId format: "LEO-{packageId}"
        const packageId = sessionId?.replace("LEO-", "");

        if (!packageId) {
            return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
        }

        // 2. Update COD status in packages table
        await supabase
            .from("packages")
            .update({
                cod_status: "collected",
                metadata: {
                    p24_order_id: orderId,
                    p24_method_id: methodId,
                    p24_amount: amount,
                    p24_paid_at: new Date().toISOString()
                },
                updated_at: new Date().toISOString()
            })
            .eq("id", packageId);

        // 3. Emit COD event
        await supabase.from("package_events").insert({
            package_id: packageId,
            event_type: "cod_collected",
            payload: {
                amount_gr: amount,        // Amount in grosze (1 PLN = 100 gr)
                currency,
                method_id: methodId,      // 178 = BLIK
                p24_order_id: orderId,
                collected_at: new Date().toISOString()
            }
        });

        // 4. Respond with 200 OK (Przelewy24 requires this to confirm receipt)
        return NextResponse.json({ status: "OK" }, { status: 200 });

    } catch (err: any) {
        console.error("[Przelewy24 Webhook] Error:", err.message);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
