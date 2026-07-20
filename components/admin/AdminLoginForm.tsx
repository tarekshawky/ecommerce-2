"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("admin-credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

  return (
    <main className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-8">
        <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent-dark grid place-items-center mb-5">
          <Lock size={20} />
        </div>
        <h1 className="text-2xl font-bold mb-1">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to manage your store.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white rounded-full py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
