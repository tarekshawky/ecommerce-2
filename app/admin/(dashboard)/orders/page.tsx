import { prisma } from "@/lib/prisma";
import { ShoppingCart } from "lucide-react";

export const runtime = "nodejs";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Orders</h1>
      <p className="text-sm text-gray-500 mb-6">{orders.length} total</p>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">{order.user.email}</div>
                <div className="text-sm text-gray-400">{order.createdAt.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
                <div className="font-bold mt-1.5 text-gray-900">
                  EGP {(order.total / 100).toFixed(2)}
                </div>
              </div>
            </div>
            <ul className="mt-3 pt-3 border-t border-gray-50 text-sm text-gray-500 space-y-1">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} x {item.quantity}
                </li>
              ))}
            </ul>
            {order.transactionId && (
              <div className="text-xs text-gray-400 mt-2">
                Paymob transaction: {order.transactionId}
              </div>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <ShoppingCart className="mx-auto text-gray-300" size={40} />
          <p className="text-gray-500 mt-3">No orders yet.</p>
        </div>
      )}
    </div>
  );
}
