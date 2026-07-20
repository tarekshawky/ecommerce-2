"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Search, Menu, X, Package, User, LogOut } from "lucide-react";
import { getGuestCartCount, onGuestCartChange } from "@/lib/guestCart";
import { onCartUpdated } from "@/lib/cartEvents";
import AccountMenu from "@/components/AccountMenu";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  // Starts at 0 on both server and client — localStorage isn't available
  // during SSR, so seeding this from guest cart state would desync the
  // server-rendered HTML from the client's first render and trigger a
  // hydration mismatch. The real count is filled in client-side below.
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      // Must run post-mount: localStorage is unavailable during SSR, so this
      // can't be read during render without desyncing from the server HTML.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartCount(getGuestCartCount());
      return onGuestCartChange(() => setCartCount(getGuestCartCount()));
    }

    async function fetchCart() {
      const res = await fetch("/api/cart/count");
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.count);
      }
    }
    fetchCart();
    return onCartUpdated(fetchCart);
  }, [status]);

  // Admin pages have their own sidebar/topbar — the storefront search and
  // cart don't belong there.
  if (pathname?.startsWith("/admin")) return null;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setMobileOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex items-center gap-4 sm:gap-6 px-4 py-4">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-accent text-white grid place-items-center font-bold text-sm">
            S
          </span>
          <span className="text-lg font-bold tracking-tight">ShopEG</span>
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden sm:flex flex-1 items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 text-sm"
        >
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-500"
          />
        </form>

        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {status === "authenticated" ? (
            <div className="hidden sm:block">
              <AccountMenu email={session.user.email ?? ""} />
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:block text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 py-2 transition-colors"
            >
              Sign in
            </Link>
          )}

          <Link href="/cart" onClick={() => setMobileOpen(false)} className="relative">
            <span className="w-9 h-9 rounded-full bg-gray-100 grid place-items-center hover:bg-gray-200 transition">
              <ShoppingBag size={17} />
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="sm:hidden w-9 h-9 rounded-full bg-gray-100 grid place-items-center hover:bg-gray-200 transition"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 px-4 py-4 space-y-4">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 text-sm"
          >
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-500"
            />
          </form>

          {status === "authenticated" && session ? (
            <div className="space-y-1">
              <p className="px-1 pb-1 text-sm font-medium text-gray-800 truncate">
                {session.user.email}
              </p>
              <Link
                href="/account/orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-1 py-2 text-sm text-gray-700"
              >
                <Package size={15} className="text-gray-400" />
                Track order
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-1 py-2 text-sm text-gray-700"
              >
                <User size={15} className="text-gray-400" />
                Edit profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2.5 px-1 py-2 text-sm text-red-600"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 py-2.5 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
