"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteUserButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete ${name || "this user"}? This can't be undone.`)) return;

    setLoading(true);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not delete this user.");
      return;
    }

    toast.success(`${name || "User"} deleted`);
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
