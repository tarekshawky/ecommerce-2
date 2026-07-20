"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "That email already has an account (likely via email/password). Sign in with your password instead, or use a different Google account.",
  OAuthSignin: "Something went wrong starting Google sign-in. Please try again.",
  OAuthCallback: "Something went wrong finishing Google sign-in. Please try again.",
  Callback: "Something went wrong finishing sign-in. Please try again.",
  AccessDenied: "Access denied. Please try again.",
  CredentialsSignin: "Incorrect email or password.",
  default: "Could not sign you in. Please try again.",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.86c2.26-2.09 3.59-5.17 3.59-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.86-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.24v3.09C3.2 21.3 7.26 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.24A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.24 5.38l4.03-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.26 0 3.2 2.7 1.24 6.62l4.03 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const urlError = params.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoading(false);
        setError(data.error || "Could not create your account.");
        return;
      }
    }

    const result = await signIn("customer-credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(ERROR_MESSAGES.CredentialsSignin);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

  return (
    <main className="min-h-screen grid place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-8">
        <div className="text-center">
          <span className="w-12 h-12 mx-auto rounded-xl bg-accent text-white grid place-items-center font-bold text-lg mb-5">
            S
          </span>
          <h1 className="text-2xl font-bold mb-1">Welcome to ShopEG</h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to save your cart across devices and check out.
          </p>
        </div>

        {(error || urlError) && (
          <p className="mb-4 text-sm bg-red-50 text-red-600 rounded-xl px-4 py-3">
            {error || ERROR_MESSAGES[urlError!] || ERROR_MESSAGES.default}
          </p>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full flex items-center justify-center gap-2.5 border border-gray-200 hover:bg-gray-50 rounded-full py-3 font-medium text-gray-700 transition-colors"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={inputClass}
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white rounded-full py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === "signup" ? "Already have an account?" : "New to ShopEG?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError("");
            }}
            className="text-accent-dark font-semibold hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </main>
  );
}
