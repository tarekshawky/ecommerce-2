"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, Lock, LocateFixed } from "lucide-react";

export default function CheckoutPage() {
  const { status } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported on this device.");
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const a = data.address || {};

          const street = [a.house_number, a.road].filter(Boolean).join(" ") || a.neighbourhood || "";
          const cityName = a.city || a.town || a.village || a.county || "";

          if (street) setAddress(street);
          if (cityName) setCity(cityName);
          if (!street && !cityName) setLocationError("Couldn't determine your address from this location.");
        } catch {
          setLocationError("Couldn't look up your address. Please enter it manually.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocationError("Location access was denied. Please enter your address manually.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address, city }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Could not start checkout.");
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

  if (status !== "authenticated") {
    return (
      <main className="max-w-md mx-auto p-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 text-accent-dark grid place-items-center">
          <Lock size={22} />
        </div>
        <h1 className="text-xl font-bold mt-4">Sign in to pay</h1>
        <p className="mt-2 text-gray-500">
          Your cart is saved — sign in to add your details and complete payment.
        </p>
        <Link
          href="/login?callbackUrl=/checkout"
          className="mt-5 inline-block bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full px-6 py-2.5"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-gray-500 mb-6 bg-accent/10 text-accent-dark rounded-xl px-4 py-3">
        Payment is processed via Paymob in <strong>test mode</strong> — use a
        Paymob test card, no real money moves.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-100 rounded-2xl p-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Phone</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+201234567890"
            className={inputClass}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={locating}
              className="flex items-center gap-1 text-xs font-medium text-accent-dark hover:underline disabled:opacity-60"
            >
              {locating ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <LocateFixed size={12} />
              )}
              {locating ? "Locating..." : "Use my current location"}
            </button>
          </div>
          <input required value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">City</label>
          <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
        </div>
        {locationError && <p className="text-red-600 text-sm">{locationError}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white font-semibold rounded-full py-3 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Starting payment..." : "Pay with Paymob"}
        </button>
      </form>
    </main>
  );
}
