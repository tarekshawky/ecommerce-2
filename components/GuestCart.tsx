"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { getGuestCart, onGuestCartChange, setGuestCartQuantity, GuestCartItem } from "@/lib/guestCart";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export default function GuestCart() {
  const [items, setItems] = useState<GuestCartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cart = getGuestCart();
      setItems(cart);

      if (cart.length === 0) {
        setProducts({});
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/products/batch?ids=${cart.map((i) => i.productId).join(",")}`);
      const data: Product[] = res.ok ? await res.json() : [];
      setProducts(Object.fromEntries(data.map((p) => [p.id, p])));
      setLoading(false);
    }

    load();
    return onGuestCartChange(load);
  }, []);

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto p-4 py-20 text-center">
        <Loader2 className="mx-auto animate-spin text-gray-300" size={32} />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto p-4 py-20 text-center">
        <ShoppingBag className="mx-auto text-gray-300" size={48} />
        <p className="mt-4 text-gray-500">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-accent font-semibold hover:underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  const total = items.reduce((sum, item) => {
    const product = products[item.productId];
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  return (
    <main className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <p className="text-sm text-gray-500 bg-accent/10 text-accent-dark rounded-xl px-4 py-3 mb-6">
        Browsing as a guest — you&apos;ll only need to sign in when you&apos;re ready to pay.
      </p>

      <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100">
        {items.map((item) => {
          const product = products[item.productId];
          if (!product) return null;
          return (
            <div key={item.productId} className="flex items-center gap-4 p-4">
              <div className="relative w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                {product.images[0] && (
                  <Image src={product.images[0]} alt={product.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{product.name}</p>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <button
                    onClick={() => setGuestCartQuantity(item.productId, item.quantity - 1)}
                    aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                    className="w-7 h-7 rounded-full border border-gray-200 grid place-items-center hover:bg-gray-50 transition-colors"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 size={13} className="text-red-500" />
                    ) : (
                      <Minus size={13} />
                    )}
                  </button>
                  <span className="w-5 text-center text-sm font-medium text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => setGuestCartQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-7 h-7 rounded-full border border-gray-200 grid place-items-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
              <span className="font-semibold text-gray-900">
                EGP {((product.price * item.quantity) / 100).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4">
        <span className="font-medium text-gray-600">Total</span>
        <span className="font-bold text-xl">EGP {(total / 100).toFixed(2)}</span>
      </div>

      <Link
        href="/login?callbackUrl=/cart"
        className="mt-4 block w-full text-center bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full py-3"
      >
        Sign in to checkout
      </Link>
    </main>
  );
}
