"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function UserForm({ user, isSelf }: { user: User; isSelf: boolean }) {
  const router = useRouter();

  const [name, setName] = useState(user.name ?? "");
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/admin/users");
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
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
        <input value={user.email} disabled className={`${inputClass} bg-gray-50 text-gray-400`} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isSelf}
          className={`${inputClass} ${isSelf ? "bg-gray-50 text-gray-400" : ""}`}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        {isSelf && (
          <p className="text-xs text-gray-400 mt-1">You can&apos;t change your own role.</p>
        )}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
