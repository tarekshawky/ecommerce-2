import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";

export const runtime = "nodejs";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ChevronLeft size={16} />
        Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold text-accent-dark">
            EGP {(product.price / 100).toFixed(2)}
          </p>

          <p className="mt-2 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-700">In stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>

          {product.description && (
            <p className="mt-5 text-gray-600 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-6 max-w-xs">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
