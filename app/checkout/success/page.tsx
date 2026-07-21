import Link from "next/link";
import CheckoutSuccessRedirect from "@/components/CheckoutSuccessRedirect";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="max-w-md mx-auto p-4 mt-16 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 grid place-items-center text-3xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold mt-5 mb-2">Payment successful</h1>
      <p className="text-gray-500 mb-6">
        {order ? `Order ${order} has been paid.` : "Your order has been paid."} This
        was a Paymob test-mode transaction — no real money was charged.
      </p>
      <Link
        href="/"
        className="inline-block bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full px-6 py-2.5"
      >
        Continue shopping
      </Link>
      <CheckoutSuccessRedirect />
    </main>
  );
}
