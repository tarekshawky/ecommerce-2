"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session) {
    return (
      <main className="max-w-md mx-auto p-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 text-accent-dark grid place-items-center">
          <Lock size={22} />
        </div>
        <h1 className="text-xl font-bold mt-4">Sign in required</h1>
        <p className="mt-2 text-gray-500">Sign in to edit your profile.</p>
        <Link
          href="/login?callbackUrl=/account"
          className="mt-5 inline-block bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full px-6 py-2.5"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return <ProfileForm session={session} />;
}

function ProfileForm({ session }: { session: Session }) {
  const { update } = useSession();
  // Safe to read directly here (no effect needed): this component only
  // mounts once the parent confirms an authenticated session exists.
  const [name, setName] = useState(session.user.name ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save changes.");
      return;
    }

    await update({ name });
    setSaved(true);
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

  return (
    <main className="max-w-md mx-auto p-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-100 rounded-2xl p-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
          <input
            value={session.user.email ?? ""}
            disabled
            className={`${inputClass} bg-gray-50 text-gray-400`}
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saved && <p className="text-green-600 text-sm">Saved.</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}
