import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return NextResponse.json(users);
}
