"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { emitCartUpdated } from "@/lib/cartEvents";

export default function CartItemControls({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateQty(next: number) {
    setLoading(true);
    await fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: next }),
    });
    emitCartUpdated();
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => updateQty(quantity - 1)}
        disabled={loading}
        aria-label={quantity === 1 ? "Remove item" : "Decrease quantity"}
        className="w-7 h-7 rounded-full border border-gray-200 grid place-items-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        {quantity === 1 ? <Trash2 size={13} className="text-red-500" /> : <Minus size={13} />}
      </button>
      <span className="w-5 text-center text-sm font-medium text-gray-800">
        {loading ? <Loader2 size={13} className="animate-spin mx-auto" /> : quantity}
      </span>
      <button
        onClick={() => updateQty(quantity + 1)}
        disabled={loading}
        aria-label="Increase quantity"
        className="w-7 h-7 rounded-full border border-gray-200 grid place-items-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
