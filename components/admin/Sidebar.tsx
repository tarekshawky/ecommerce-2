"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Store, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

function closeMobileSidebar() {
  const checkbox = document.getElementById("admin-sidebar-toggle") as HTMLInputElement | null;
  if (checkbox) checkbox.checked = false;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <label
        htmlFor="admin-sidebar-toggle"
        className="hidden peer-checked:block md:!hidden fixed inset-0 bg-black/40 z-40"
      />
      <aside
        className="fixed md:sticky inset-y-0 left-0 top-0 z-50 w-72 md:w-60 shrink-0 bg-white border-r border-gray-100 h-screen flex flex-col -translate-x-full peer-checked:translate-x-0 md:translate-x-0 transition-transform duration-200"
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/admin" className="flex items-center gap-2" onClick={closeMobileSidebar}>
            <span className="w-8 h-8 rounded-lg bg-accent text-white grid place-items-center font-bold text-sm">
              S
            </span>
            <span className="font-bold text-lg tracking-tight">ShopEG</span>
          </Link>
          <label
            htmlFor="admin-sidebar-toggle"
            className="md:hidden w-8 h-8 rounded-lg grid place-items-center hover:bg-gray-50 cursor-pointer text-gray-500"
          >
            <X size={18} />
          </label>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobileSidebar}
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
          onClick={closeMobileSidebar}
          className="mx-3 mb-6 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        >
          <Store size={18} />
          View store
        </Link>
      </aside>
    </>
  );
}
