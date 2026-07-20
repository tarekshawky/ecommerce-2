import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/60 transition-shadow">
      <Link href={`/product/${product.id}`} className="relative aspect-square bg-gray-100 overflow-hidden block">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-300 text-sm">
            No image
          </div>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
      </Link>
      <div className="p-3.5">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5em] hover:text-accent-dark">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="font-bold text-gray-900">EGP {(product.price / 100).toFixed(2)}</p>
          {hasDiscount && (
            <p className="text-xs text-gray-400 line-through">
              EGP {(product.originalPrice! / 100).toFixed(2)}
            </p>
          )}
        </div>
        <div className="mt-3">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
