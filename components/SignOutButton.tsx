"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
    >
      <LogOut size={15} />
      Sign out
    </button>
  );
}
