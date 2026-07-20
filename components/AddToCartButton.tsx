"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { addToGuestCart } from "@/lib/guestCart";
import { emitCartUpdated } from "@/lib/cartEvents";

interface Props {
  productId: string;
}

export default function AddToCartButton({ productId }: Props) {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    // Guests can add to cart freely — an account is only required at checkout.
    if (status !== "authenticated") {
      addToGuestCart(productId);
      setAdded(true);
      toast.success("Added to cart");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      setAdded(true);
      emitCartUpdated();
      toast.success("Added to cart");
    } else {
      toast.error("Could not add to cart");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading || added}
      className={`w-full flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-colors ${
        added
          ? "bg-green-100 text-green-700"
          : "bg-accent hover:bg-accent-dark text-white disabled:opacity-60"
      }`}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : added ? (
        <Check size={15} />
      ) : (
        <Plus size={15} />
      )}
      {loading ? "Adding" : added ? "Added" : "Add to Cart"}
    </button>
  );
}
