"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, Package, LogOut, ChevronDown } from "lucide-react";

export default function AccountMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent-dark grid place-items-center font-semibold text-xs">
          {email[0]?.toUpperCase()}
        </span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-40">
          <div className="px-4 py-2 border-b border-gray-50">
            <p className="text-sm font-medium text-gray-800 truncate">{email}</p>
          </div>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Package size={15} className="text-gray-400" />
            Track order
          </Link>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User size={15} className="text-gray-400" />
            Edit profile
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
