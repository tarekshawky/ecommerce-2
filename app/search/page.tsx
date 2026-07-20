import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const runtime = "nodejs";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query
    ? await prisma.product.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {products.length} {products.length === 1 ? "product" : "products"} found
      </p>

      {products.length === 0 ? (
        <p className="text-gray-500">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
