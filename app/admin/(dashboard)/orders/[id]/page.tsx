import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin, User, Phone } from "lucide-react";
import OrderStatusControl from "@/components/admin/OrderStatusControl";

export const runtime = "nodejs";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  DELIVERED: "bg-blue-50 text-blue-700",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ChevronLeft size={16} />
        Back to orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order details</h1>
          <p className="text-sm text-gray-500 mt-1">{order.id}</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3">
                  <div className="relative w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    EGP {((item.product.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
              <span className="font-medium text-gray-600">Total</span>
              <span className="font-bold text-lg">EGP {(order.total / 100).toFixed(2)}</span>
            </div>
          </div>

          {order.transactionId && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h2 className="font-semibold text-gray-800 mb-2">Payment</h2>
              <p className="text-sm text-gray-500">Paymob transaction ID</p>
              <p className="text-sm font-mono text-gray-800 mt-1">{order.transactionId}</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Status</h2>
            <OrderStatusControl orderId={order.id} status={order.status} />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Customer</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-gray-700">
                <User size={15} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p>{order.shippingName || order.user.name || "—"}</p>
                  <p className="text-gray-400">{order.user.email}</p>
                </div>
              </div>
              {order.shippingPhone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={15} className="shrink-0 text-gray-400" />
                  {order.shippingPhone}
                </div>
              )}
              {(order.shippingAddress || order.shippingCity) && (
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />
                  <span>{[order.shippingAddress, order.shippingCity].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-sm text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Placed</span>
              <span className="text-gray-800">{order.createdAt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Updated</span>
              <span className="text-gray-800">{order.updatedAt.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
