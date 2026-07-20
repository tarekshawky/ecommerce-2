import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = url.searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  if (ids.length === 0) return NextResponse.json([]);

  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  return NextResponse.json(products);
}
