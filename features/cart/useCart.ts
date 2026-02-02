"use client";

import { useEffect, useState } from "react";
import { cartStore } from "./cart.store";
import type { CartItem } from "@/types/cart";

export default function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cartStore.get());
  }, []);

  const add = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems(cartStore.add(item, qty));
  };

  const remove = (id: string) => {
    setItems(cartStore.remove(id));
  };

  const updateQty = (id: string, qty: number) => {
    setItems(cartStore.updateQty(id, qty));
  };

  const clear = () => {
    cartStore.clear();
    setItems([]);
  };

  const total = items.reduce((sum, x) => sum + x.price * x.qty, 0);

  return { items, add, remove, updateQty, clear, total };
}
