"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["PENDING", "PAID", "FAILED", "DELIVERED"] as const;

export default function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(status);

  async function updateStatus(next: string) {
    const previous = value;
    setValue(next);
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setValue(previous);
      toast.error(data.error || "Could not update order status.");
      return;
    }

    toast.success(`Order marked as ${next}`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => updateStatus(e.target.value)}
        disabled={loading}
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {loading && <Loader2 size={16} className="animate-spin text-gray-400" />}
    </div>
  );
}
