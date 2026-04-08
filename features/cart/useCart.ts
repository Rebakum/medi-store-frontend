"use client";

import { useEffect, useMemo, useState } from "react";
import { cartStore } from "./cart.store";
import type { CartItem } from "./cart.store";

export default function useCart() {
  const [items, setItems] = useState<CartItem[]>(cartStore.get());

  useEffect(() => {
    setItems(cartStore.get());
    const unsub = cartStore.subscribe(() => setItems(cartStore.get()));
    return () => {
      unsub();
    };
  }, []);

  const add = (item: Omit<CartItem, "qty">, qty = 1) => cartStore.add(item, qty);
  const remove = (id: string) => cartStore.remove(id);
  const updateQty = (id: string, qty: number) => cartStore.updateQty(id, qty);
  const clear = () => cartStore.clear();

  const total = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, x) => sum + x.qty, 0),
    [items]
  );

  return { items, add, remove, updateQty, clear, total, count };
}
