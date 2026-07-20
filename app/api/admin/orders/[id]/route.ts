import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["PENDING", "PAID", "FAILED", "DELIVERED"] as const;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json(order);
}
