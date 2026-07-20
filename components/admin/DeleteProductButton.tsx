"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
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
