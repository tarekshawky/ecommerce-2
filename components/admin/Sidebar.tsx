"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Store } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col">
      <Link href="/admin" className="flex items-center gap-2 px-6 py-6">
        <span className="w-8 h-8 rounded-lg bg-accent text-white grid place-items-center font-bold text-sm">
          S
        </span>
        <span className="font-bold text-lg tracking-tight">ShopEG</span>
      </Link>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/10 text-accent-dark"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mx-3 mb-6 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      >
        <Store size={18} />
        View store
      </Link>
    </aside>
  );
}
