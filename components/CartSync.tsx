"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getGuestCart, clearGuestCart } from "@/lib/guestCart";

// Mounted once at the root. The moment a guest signs in, whatever they had
// in their localStorage cart gets folded into their real (DB-backed) cart.
export default function CartSync() {
  const { status } = useSession();
  const router = useRouter();
  const merged = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || merged.current) return;

    const items = getGuestCart();
    if (items.length === 0) return;

    merged.current = true;

    (async () => {
      await Promise.all(
        items.map((item) =>
          fetch("/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
          })
        )
      );
      clearGuestCart();
      router.refresh();
    })();
  }, [status, router]);

  return null;
}
