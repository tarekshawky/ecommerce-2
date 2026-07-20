import Link from "next/link";

export default async function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="max-w-md mx-auto p-4 mt-16 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 grid place-items-center text-3xl">
        ✕
      </div>
      <h1 className="text-2xl font-bold mt-5 mb-2">Payment failed</h1>
      <p className="text-gray-500 mb-6">
        {order ? `Order ${order} could not be paid.` : "Your payment could not be completed."}{" "}
        Please try again.
      </p>
      <Link
        href="/checkout"
        className="inline-block bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full px-6 py-2.5"
      >
        Back to checkout
      </Link>
    </main>
  );
}
