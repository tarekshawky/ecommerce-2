import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  if (!productId) return NextResponse.json({ error: "ProductId is required" }, { status: 400 });
  const qty = typeof quantity === "number" && quantity > 0 ? quantity : 1;

  // 1️⃣ Get or create the cart
  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

  // 2️⃣ Upsert CartItem
  const cartItem = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity: qty },
    update: { quantity: { increment: qty } },
  });

  return NextResponse.json({ cartItem });
}