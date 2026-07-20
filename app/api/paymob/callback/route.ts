import { verifyHmac } from "@/lib/paymob";
import { NextResponse } from "next/server";

// Browser redirect target configured as the "Transaction Response Callback"
// in the Paymob dashboard. This is UX only — order status is set by the
// server-to-server webhook at /api/paymob/webhook, not here.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const hmac = params.hmac || "";

  const valid = verifyHmac(params, hmac);
  const success = valid && (params.success === "true" || params.success === "1");

  const destination = success ? "/checkout/success" : "/checkout/failed";
  const orderId = params.merchant_order_id;

  return NextResponse.redirect(
    new URL(`${destination}${orderId ? `?order=${orderId}` : ""}`, req.url)
  );
}
