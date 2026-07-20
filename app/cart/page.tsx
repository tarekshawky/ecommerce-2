import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import GuestCart from "@/components/GuestCart";
import CartItemControls from "@/components/CartItemControls";

export const runtime = "nodejs";

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <GuestCart />;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0)
    return (
      <main className="max-w-2xl mx-auto p-4 py-20 text-center">
        <ShoppingBag className="mx-auto text-gray-300" size={48} />
        <p className="mt-4 text-gray-500">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-accent font-semibold hover:underline">
          Continue shopping
        </Link>
      </main>
    );

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="relative w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
              {item.product.images[0] && (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.product.name}</p>
              <div className="mt-1.5">
                <CartItemControls productId={item.productId} quantity={item.quantity} />
              </div>
            </div>
            <span className="font-semibold text-gray-900">
              EGP {((item.product.price * item.quantity) / 100).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4">
        <span className="font-medium text-gray-600">Total</span>
        <span className="font-bold text-xl">EGP {(total / 100).toFixed(2)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block text-center bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full py-3"
      >
        Proceed to checkout
      </Link>
    </main>
  );
}
