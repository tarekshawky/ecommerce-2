import { prisma } from "@/lib/prisma";
import { requireAdminSession, normalizeImages, normalizeCategory } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, price, originalPrice, stock, images, category } = body;

  if (!name || typeof price !== "number") {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price,
      originalPrice: typeof originalPrice === "number" ? originalPrice : null,
      stock: typeof stock === "number" ? stock : 0,
      images: normalizeImages(images),
      category: normalizeCategory(category),
    },
  });

  return NextResponse.json(product, { status: 201 });
}
