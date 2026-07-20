import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Package, Lock } from "lucide-react";

export const runtime = "nodejs";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  DELIVERED: "bg-blue-50 text-blue-700",
};

export default async function OrderTrackingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="max-w-md mx-auto p-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 text-accent-dark grid place-items-center">
          <Lock size={22} />
        </div>
        <h1 className="text-xl font-bold mt-4">Sign in required</h1>
        <p className="mt-2 text-gray-500">Sign in to track your orders.</p>
        <Link
          href="/login?callbackUrl=/account/orders"
          className="mt-5 inline-block bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full px-6 py-2.5"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <main className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Package className="mx-auto text-gray-300" size={40} />
          <p className="text-gray-500 mt-3">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="mt-4 inline-block text-accent font-semibold hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">{order.createdAt.toLocaleString()}</div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
              <ul className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">
                      {item.product.name} x {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-sm text-gray-500">Total</span>
                <span className="font-bold text-gray-900">EGP {(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
