"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function VisaBadge() {
  return (
    <span className="flex items-center justify-center w-12 h-8 rounded-md bg-[#1a1f71] text-white text-[13px] font-bold italic tracking-tight">
      VISA
    </span>
  );
}

function MastercardBadge() {
  return (
    <span className="relative flex items-center justify-center w-12 h-8 rounded-md bg-gray-50 border border-gray-200">
      <span className="absolute w-4 h-4 rounded-full bg-[#eb001b] -translate-x-[5px]" />
      <span className="absolute w-4 h-4 rounded-full bg-[#f79e1b] opacity-80 translate-x-[5px]" />
    </span>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // Admin pages have their own layout — the storefront footer doesn't belong there.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center gap-1.5">
              <span className="w-8 h-8 rounded-lg bg-accent text-white grid place-items-center font-bold text-sm">
                S
              </span>
              <span className="text-lg font-bold tracking-tight">ShopEG</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              Quality products, fast delivery across Egypt.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">Quick links</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-900">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-gray-900">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-gray-900">
                  Track order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">We accept</p>
            <div className="flex items-center gap-2">
              <VisaBadge />
              <MastercardBadge />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-50 text-xs text-gray-400 text-center">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://tarekshawky.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600"
          >
            Tarek Shawky
          </a>
          . All rights reserved.
        </div>
      </div>
    </footer>
  );
}
