import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
