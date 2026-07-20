import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { isCategoryValue, CategoryValue } from "./categories";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images.filter((url): url is string => typeof url === "string" && url.trim() !== "").slice(0, 4);
}

export function normalizeCategory(category: unknown): CategoryValue | null {
  return typeof category === "string" && isCategoryValue(category) ? category : null;
}
