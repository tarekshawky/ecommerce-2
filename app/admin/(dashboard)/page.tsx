import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingCart, Clock, Wallet } from "lucide-react";

export const runtime = "nodejs";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true },
    }),
  ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products", icon: Package },
    { label: "Orders", value: orderCount, href: "/admin/orders", icon: ShoppingCart },
    { label: "Pending orders", value: pendingCount, href: "/admin/orders", icon: Clock },
    {
      label: "Revenue (paid)",
      value: `EGP ${((revenue._sum.total ?? 0) / 100).toFixed(2)}`,
      href: "/admin/orders",
      icon: Wallet,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Overview of your store.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:shadow-gray-200/60 transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent-dark grid place-items-center">
              <s.icon size={18} />
            </div>
            <div className="text-sm text-gray-500 mt-4">{s.label}</div>
            <div className="text-2xl font-bold mt-1 text-gray-900">{s.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
