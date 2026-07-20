import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  if (!productId || typeof quantity !== "number") {
    return NextResponse.json({ error: "productId and quantity are required" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    return NextResponse.json({ removed: true });
  }

  const cartItem = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity },
  });

  return NextResponse.json({ cartItem });
}
