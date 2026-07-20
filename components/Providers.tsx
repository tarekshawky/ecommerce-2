"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import CartSync from "@/components/CartSync";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartSync />
      <Toaster position="top-center" richColors closeButton />
      {children}
    </SessionProvider>
  );
}
