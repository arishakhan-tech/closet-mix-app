export type Category = "tops" | "bottoms" | "shoes" | "accessories" | "outerwear" | "dresses";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "tops", label: "Tops", emoji: "👕" },
  { value: "bottoms", label: "Bottoms", emoji: "👖" },
  { value: "shoes", label: "Shoes", emoji: "👟" },
  { value: "accessories", label: "Accessories", emoji: "🎒" },
  { value: "outerwear", label: "Outerwear", emoji: "🧥" },
  { value: "dresses", label: "Dresses", emoji: "👗" },
];

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: Category;
  name: string;
}

export interface Outfit {
  id: string;
  items: ClothingItem[];
  savedAt: string;
}

const STORAGE_KEY = "digital-closet";
const OUTFITS_KEY = "saved-outfits";

export function getItems(): ClothingItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveItems(items: ClothingItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addItem(item: ClothingItem) {
  const items = getItems();
  items.push(item);
  saveItems(items);
}

export function removeItem(id: string) {
  saveItems(getItems().filter((i) => i.id !== id));
}

export function getSavedOutfits(): Outfit[] {
  const raw = localStorage.getItem(OUTFITS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveOutfit(outfit: Outfit) {
  const outfits = getSavedOutfits();
  outfits.push(outfit);
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
}

export function removeOutfit(id: string) {
  const outfits = getSavedOutfits().filter((o) => o.id !== id);
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
}

export function generateRandomOutfit(items: ClothingItem[]): ClothingItem[] {
  const byCategory = new Map<Category, ClothingItem[]>();
  items.forEach((item) => {
    const list = byCategory.get(item.category) || [];
    list.push(item);
    byCategory.set(item.category, list);
  });

  const outfit: ClothingItem[] = [];
  const pick = (cat: Category) => {
    const list = byCategory.get(cat);
    if (list?.length) outfit.push(list[Math.floor(Math.random() * list.length)]);
  };

  // Try to build a coherent outfit
  if (byCategory.has("dresses")) {
    // 50% chance to use a dress instead of top+bottom
    if (Math.random() > 0.5) {
      pick("dresses");
    } else {
      pick("tops");
      pick("bottoms");
    }
  } else {
    pick("tops");
    pick("bottoms");
  }
  pick("shoes");
  pick("outerwear");
  pick("accessories");

  return outfit;
}
