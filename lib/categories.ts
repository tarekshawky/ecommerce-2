import { Shirt, Footprints, Backpack, Watch, Glasses, Gem, Headphones } from "lucide-react";

export const CATEGORIES = [
  { value: "T_SHIRT", label: "T-Shirt", icon: Shirt },
  { value: "SHOES", label: "Shoes", icon: Footprints },
  { value: "BAG", label: "Bag", icon: Backpack },
  { value: "WATCHES", label: "Watches", icon: Watch },
  { value: "GLASSES", label: "Glasses", icon: Glasses },
  { value: "JEWELRY", label: "Jewelry", icon: Gem },
  { value: "AUDIO", label: "Audio", icon: Headphones },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function isCategoryValue(value: string): value is CategoryValue {
  return CATEGORIES.some((c) => c.value === value);
}

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
