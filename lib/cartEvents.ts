"use client";

const EVENT = "cart-updated";

// Fired whenever the authenticated (DB-backed) cart changes, so the Navbar
// badge and any open cart view can refresh without a full page reload.
export function emitCartUpdated() {
  window.dispatchEvent(new Event(EVENT));
}

export function onCartUpdated(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
