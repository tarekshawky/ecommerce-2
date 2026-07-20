import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createIntention, getUnifiedCheckoutUrl } from "@/lib/paymob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone, address, city } = body;

  if (!name || !phone || !address || !city) {
    return NextResponse.json({ error: "name, phone, address and city are required" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      shippingName: name,
      shippingPhone: phone,
      shippingAddress: address,
      shippingCity: city,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  try {
    const [firstName, ...rest] = name.split(" ");

    const clientSecret = await createIntention(
      total,
      order.id,
      cart.items.map((item) => ({
        name: item.product.name,
        amount: item.product.price,
        description: item.product.name,
        quantity: item.quantity,
      })),
      {
        first_name: firstName,
        last_name: rest.join(" ") || firstName,
        email: session.user.email || "na@example.com",
        phone_number: phone,
        city,
        street: address,
      }
    );

    return NextResponse.json({ checkoutUrl: getUnifiedCheckoutUrl(clientSecret) });
  } catch (err) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    console.error("Paymob checkout error:", err);
    return NextResponse.json({ error: "Failed to start payment" }, { status: 502 });
  }
}
