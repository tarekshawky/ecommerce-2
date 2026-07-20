"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/categories";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  images: string[];
  category: string | null;
}

const MAX_IMAGES = 4;

function ImageSlot({
  index,
  value,
  onChange,
}: {
  index: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });

    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Upload failed");
      return;
    }

    const data = await res.json();
    onChange(data.url);
    toast.success("Image uploaded");
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
          {value && <Image src={value} alt="" fill sizes="48px" className="object-cover" />}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={index === 0 ? "Cover image URL" : `Image ${index + 1} URL`}
          className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload image"
          className="shrink-0 w-10 h-10 rounded-xl border border-gray-200 grid place-items-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? (product.price / 100).toString() : "");
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? (product.originalPrice / 100).toString() : ""
  );
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [category, setCategory] = useState(product?.category ?? "");
  const [images, setImages] = useState<string[]>(() => {
    const initial = product?.images ?? [];
    return [...initial, ...Array(MAX_IMAGES - initial.length).fill("")].slice(0, MAX_IMAGES);
  });
  const [loading, setLoading] = useState(false);

  function updateImage(index: number, value: string) {
    setImages((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      description,
      price: Math.round(parseFloat(price) * 100),
      originalPrice: originalPrice ? Math.round(parseFloat(originalPrice) * 100) : null,
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
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success(isEdit ? "Product updated" : "Product created");
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
          <label className="block text-sm font-medium mb-1.5 text-gray-700">
            Original price <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Shown crossed out"
            className={inputClass}
          />
        </div>
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
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
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
            <ImageSlot key={i} index={i} value={url} onChange={(v) => updateImage(i, v)} />
          ))}
        </div>
      </div>
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
