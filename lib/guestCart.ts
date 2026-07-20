"use client";

const KEY = "guest_cart";
const EVENT = "guest-cart-updated";

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(cart: GuestCartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(EVENT));
}

export function addToGuestCart(productId: string) {
  const cart = getGuestCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ productId, quantity: 1 });
  save(cart);
}

export function setGuestCartQuantity(productId: string, quantity: number) {
  const cart = getGuestCart();
  if (quantity <= 0) {
    save(cart.filter((i) => i.productId !== productId));
    return;
  }
  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.quantity = quantity;
  else cart.push({ productId, quantity });
  save(cart);
}

export function removeFromGuestCart(productId: string) {
  save(getGuestCart().filter((i) => i.productId !== productId));
}

export function clearGuestCart() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function onGuestCartChange(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
