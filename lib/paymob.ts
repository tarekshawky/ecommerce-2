import crypto from "crypto";

const BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";

interface BillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  street: string;
  country: string;
  state: string;
}

interface IntentionItem {
  name: string;
  amount: number;
  description: string;
  quantity: number;
}

// Paymob's newer Unified Intention API. Auth is a Secret Key in the
// Authorization header (not the legacy api_key exchange), and checkout
// happens on Paymob's own hosted "unified checkout" page rather than an
// iframe embedded on our own /checkout page.
export async function createIntention(
  amountCents: number,
  merchantOrderId: string,
  items: IntentionItem[],
  billing: Partial<BillingData>
): Promise<string> {
  const billingData: BillingData = {
    first_name: billing.first_name || "NA",
    last_name: billing.last_name || "NA",
    email: billing.email || "na@example.com",
    phone_number: billing.phone_number || "NA",
    city: billing.city || "NA",
    street: billing.street || "NA",
    country: "EG",
    state: "NA",
  };

  const res = await fetch(`${BASE_URL}/v1/intention/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
    },
    body: JSON.stringify({
      amount: amountCents,
      currency: "EGP",
      payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],
      items,
      billing_data: billingData,
      special_reference: merchantOrderId,
    }),
  });

  if (!res.ok) throw new Error(`Paymob intention failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.client_secret as string;
}

export function getUnifiedCheckoutUrl(clientSecret: string): string {
  const publicKey = process.env.PAYMOB_PUBLIC_KEY;
  return `${BASE_URL}/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
}

// Fields Paymob signs, in the exact order required, for both the
// server-to-server webhook ("obj") and the browser redirect (flat query).
const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auction",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
];

function getField(source: Record<string, unknown>, field: string): string {
  if (field.startsWith("source_data.")) {
    const key = field.split(".")[1];
    const sourceData = source["source_data"] as Record<string, unknown> | undefined;
    return sourceData?.[key] !== undefined ? String(sourceData[key]) : "";
  }
  const value = source[field];
  return value !== undefined && value !== null ? String(value) : "";
}

export function verifyHmac(source: Record<string, unknown>, receivedHmac: string): boolean {
  const secret = process.env.PAYMOB_HMAC_SECRET;
  if (!secret || !receivedHmac) return false;

  const concatenated = HMAC_FIELDS.map((f) => getField(source, f)).join("");
  const computed = crypto.createHmac("sha512", secret).update(concatenated).digest("hex");

  const computedBuf = Buffer.from(computed, "hex");
  const receivedBuf = Buffer.from(receivedHmac, "hex");
  if (computedBuf.length !== receivedBuf.length) return false;

  return crypto.timingSafeEqual(computedBuf, receivedBuf);
}
