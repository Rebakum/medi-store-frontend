import type { CartItem } from "@/types/cart";

const KEY = "medistore_cart";

export const cartStore = {
  get(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  },

  set(items: CartItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(items));
  },

  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
  },

  add(item: Omit<CartItem, "qty">, qty = 1) {
    const items = this.get();
    const found = items.find((x) => x.id === item.id);

    if (found) {
      found.qty += qty;
    } else {
      items.push({ ...item, qty });
    }

    this.set(items);
    return items;
  },

  remove(id: string) {
    const items = this.get().filter((x) => x.id !== id);
    this.set(items);
    return items;
  },

  updateQty(id: string, qty: number) {
    const items = this.get().map((x) =>
      x.id === id ? { ...x, qty: Math.max(1, qty) } : x
    );
    this.set(items);
    return items;
  },
};
