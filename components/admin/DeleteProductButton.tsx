"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not delete this product.");
      return;
    }

    toast.success("Product deleted");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
    >
      <Trash2 size={14} />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
