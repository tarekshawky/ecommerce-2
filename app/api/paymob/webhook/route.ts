import { prisma } from "@/lib/prisma";
import { verifyHmac } from "@/lib/paymob";
import { NextResponse } from "next/server";

// Server-to-server "Transaction Processed Callback" configured in the
// Paymob dashboard for this integration. This is the source of truth for
// order status — the browser redirect callback is UX only.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const hmac = url.searchParams.get("hmac") || "";

  const body = await req.json().catch(() => null);
  const obj = body?.obj;
  if (!obj) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const hmacSource = {
    amount_cents: obj.amount_cents,
    created_at: obj.created_at,
    currency: obj.currency,
    error_occured: obj.error_occured,
    has_parent_transaction: obj.has_parent_transaction,
    id: obj.id,
    integration_id: obj.integration_id,
    is_3d_secure: obj.is_3d_secure,
    is_auction: obj.is_auction,
    is_capture: obj.is_capture,
    is_refunded: obj.is_refunded,
    is_standalone_payment: obj.is_standalone_payment,
    is_voided: obj.is_voided,
    order: obj.order?.id,
    owner: obj.owner,
    pending: obj.pending,
    source_data: obj.source_data,
    success: obj.success,
  };

  if (!verifyHmac(hmacSource, hmac)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const merchantOrderId: string | undefined = obj.order?.merchant_order_id;
  const paymobOrderId = obj.order?.id ? String(obj.order.id) : undefined;

  const order = merchantOrderId
    ? await prisma.order.findUnique({ where: { id: merchantOrderId } })
    : paymobOrderId
      ? await prisma.order.findUnique({ where: { paymobOrderId } })
      : null;

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const success = obj.success === true || obj.success === "true";

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: success ? "PAID" : "FAILED",
      transactionId: String(obj.id),
    },
  });

  if (success) {
    await prisma.cartItem.deleteMany({ where: { cart: { userId: order.userId } } });
  }

  return NextResponse.json({ success: true });
}
