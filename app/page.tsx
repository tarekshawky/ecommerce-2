import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Grid2x2 } from "lucide-react";
import { CATEGORIES, isCategoryValue, categoryLabel } from "@/lib/categories";

export const runtime = "nodejs";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category && isCategoryValue(category) ? category : null;

  const products = await prisma.product.findMany({
    where: activeCategory ? { category: activeCategory } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white px-8 py-14 sm:px-14 sm:py-20">
        <p className="text-accent font-semibold text-sm tracking-wide">#Big Season Sale</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold max-w-lg leading-tight">
          Limited Time Offer! Up to 50% OFF
        </h1>
        <p className="mt-4 text-gray-300 max-w-md">
          Redefine your everyday style with our latest collection.
        </p>
        <a
          href="#products"
          className="mt-8 inline-block bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full px-6 py-3"
        >
          Shop Now
        </a>
      </section>

      {/* Categories */}
      <section className="mt-10 grid grid-cols-4 sm:grid-cols-8 gap-4">
        {CATEGORIES.map(({ value, label, icon: Icon }) => (
          <Link
            key={value}
            href={`/?category=${value}#products`}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div
              className={`w-14 h-14 rounded-full border grid place-items-center shadow-sm transition-colors ${
                activeCategory === value
                  ? "bg-accent border-accent text-white"
                  : "bg-white border-gray-100 text-gray-700 hover:border-accent/40"
              }`}
            >
              <Icon size={22} />
            </div>
            <span
              className={`text-xs font-medium ${activeCategory === value ? "text-accent-dark" : "text-gray-600"}`}
            >
              {label}
            </span>
          </Link>
        ))}
        <Link href="/#products" className="flex flex-col items-center gap-2 text-center">
          <div
            className={`w-14 h-14 rounded-full border grid place-items-center shadow-sm transition-colors ${
              !activeCategory
                ? "bg-accent border-accent text-white"
                : "bg-white border-gray-100 text-gray-700 hover:border-accent/40"
            }`}
          >
            <Grid2x2 size={22} />
          </div>
          <span className={`text-xs font-medium ${!activeCategory ? "text-accent-dark" : "text-gray-600"}`}>
            All
          </span>
        </Link>
      </section>

      {/* Products */}
      <section id="products" className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {activeCategory ? categoryLabel(activeCategory) : "All Products"}
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">
            {activeCategory ? "No products in this category yet." : "No products yet — check back soon."}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
