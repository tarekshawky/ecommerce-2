"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  images: string[];
  category: string | null;
}

const MAX_IMAGES = 4;

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? (product.price / 100).toString() : "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [category, setCategory] = useState(product?.category ?? "");
  const [images, setImages] = useState<string[]>(() => {
    const initial = product?.images ?? [];
    return [...initial, ...Array(MAX_IMAGES - initial.length).fill("")].slice(0, MAX_IMAGES);
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateImage(index: number, value: string) {
    setImages((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name,
      description,
      price: Math.round(parseFloat(price) * 100),
      stock: parseInt(stock, 10),
      category: category || null,
      images: images.map((url) => url.trim()).filter(Boolean),
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md bg-white border border-gray-100 rounded-2xl p-6"
    >
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Price (EGP)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">No category</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          Images <span className="text-gray-400 font-normal">(up to {MAX_IMAGES}, first is the cover)</span>
        </label>
        <div className="space-y-2">
          {images.map((url, i) => (
            <input
              key={i}
              value={url}
              onChange={(e) => updateImage(i, e.target.value)}
              placeholder={i === 0 ? "Cover image URL" : `Image ${i + 1} URL`}
              className={inputClass}
            />
          ))}
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
