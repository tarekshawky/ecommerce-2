import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const runtime = "nodejs";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark transition-colors text-white rounded-full px-4 py-2.5 text-sm font-semibold"
        >
          <Plus size={16} />
          New product
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-5">Price</th>
                <th className="py-3 px-5">Stock</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-gray-700">EGP {(p.price / 100).toFixed(2)}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        p.stock === 0 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/products/${p.id}`} className="text-accent-dark hover:underline text-sm font-medium">
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <p className="text-gray-500 text-sm p-8 text-center">No products yet.</p>
        )}
      </div>
    </div>
  );
}
