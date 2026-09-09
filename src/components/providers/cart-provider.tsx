"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cartItemKey, computeTotals, type CartTotals } from "@/lib/cart";
import type { CartItem } from "@/lib/types";
import { useToast } from "./toast-provider";

const STORAGE_KEY = "full.cart.v1";

interface StoredCart {
  items: CartItem[];
  promoCode: string | null;
}

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  promoCode: string | null;
  hydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  applyPromo: (code: string | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): StoredCart {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], promoCode: null };
    const parsed = JSON.parse(raw) as StoredCart;
    if (!Array.isArray(parsed.items)) return { items: [], promoCode: null };
    return { items: parsed.items, promoCode: parsed.promoCode ?? null };
  } catch {
    return { items: [], promoCode: null };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const syncTimer = useRef<number | null>(null);

  useEffect(() => {
    const stored = readStorage();
    setItems(stored.items);
    setPromoCode(stored.promoCode);
    setHydrated(true);
  }, []);

  // Persist locally, then best-effort sync to the signed-in account.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, promoCode }));
    } catch {
      /* private mode / quota — cart still works for this session */
    }

    if (syncTimer.current) window.clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(() => {
      void fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, promoCode }),
        keepalive: true,
      }).catch(() => {
        /* offline or no database configured — local cart is the source of truth */
      });
    }, 1200);
  }, [items, promoCode, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "key" | "quantity">, quantity = 1) => {
      const key = cartItemKey(item);
      setItems((current) => {
        const existing = current.find((entry) => entry.key === key);
        if (existing) {
          return current.map((entry) =>
            entry.key === key ? { ...entry, quantity: entry.quantity + quantity } : entry,
          );
        }
        return [...current, { ...item, key, quantity }];
      });
      toast({
        title: `${item.kind === "box" ? item.name : item.flavor} added.`,
        description:
          item.mode === "subscription"
            ? "Subscription — 15% off, skip or cancel anytime."
            : `${item.protein} g protein · ${item.calories} kcal`,
      });
    },
    [toast],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((entry) => entry.key !== key)
        : current.map((entry) => (entry.key === key ? { ...entry, quantity } : entry)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((entry) => entry.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
  }, []);

  const totals = useMemo(() => computeTotals(items, promoCode), [items, promoCode]);

  const value = useMemo(
    () => ({
      items,
      totals,
      promoCode,
      hydrated,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyPromo: setPromoCode,
    }),
    [items, totals, promoCode, hydrated, isOpen, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
