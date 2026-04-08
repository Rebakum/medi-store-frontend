// features/cart/cart.store.ts
type Listener = () => void;

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

let items: CartItem[] = [];
const listeners = new Set<Listener>();

export const cartStore = {
  get() {
    return items;
  },

  set(next: CartItem[]) {
    items = next;
    listeners.forEach((l) => l());
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener); // ✅ void
    };
  },

  add(item: Omit<CartItem, "qty">, qty = 1) {
    const list = this.get();
    const found = list.find((x) => x.id === item.id);

    if (found) found.qty += qty;
    else list.push({ ...item, qty });

    this.set([...list]); 
    return this.get();
  },

  remove(id: string) {
    const next = this.get().filter((x) => x.id !== id);
    this.set(next);
    return this.get();
  },

  updateQty(id: string, qty: number) {
    const next = this.get().map((x) =>
      x.id === id ? { ...x, qty: Math.max(1, qty) } : x
    );
    this.set(next);
    return this.get();
  },

  clear() {
    this.set([]);
  },
};
