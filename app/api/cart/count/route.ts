import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ count: 0 });

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  });

  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  return NextResponse.json({ count });
}
