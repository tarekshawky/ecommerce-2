import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { NextResponse } from "next/server";

const VALID_ROLES = ["USER", "ADMIN"] as const;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, role } = await req.json();

  if (role !== undefined) {
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    // Don't let an admin strip their own admin access — easy way to get
    // permanently locked out of the dashboard with no one else to fix it.
    if (id === session.user.id && role !== "ADMIN") {
      return NextResponse.json({ error: "You can't remove your own admin access" }, { status: 400 });
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name || null }),
      ...(role !== undefined && { role }),
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, role: user.role });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
  }

  const orderCount = await prisma.order.count({ where: { userId: id } });
  if (orderCount > 0) {
    return NextResponse.json(
      { error: "This user has order history and can't be deleted." },
      { status: 400 }
    );
  }

  // Cart/CartItem aren't cascade-deleted at the DB level; Account/Session
  // already are (see schema.prisma), so only these need cleaning up first.
  await prisma.cartItem.deleteMany({ where: { cart: { userId: id } } });
  await prisma.cart.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
