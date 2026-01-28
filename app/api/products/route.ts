import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      stock: body.stock,
    },
  });

  return NextResponse.json(product);
}
