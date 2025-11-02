"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Order, Product } from '@/lib/types';
import { seedProducts } from '@/lib/data';

const PRODUCTS_KEY = 'shop.products';
const CART_KEY = 'shop.cart';
const ORDERS_KEY = 'shop.orders';

export type ShopState = {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
};

export type ShopActions = {
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Order | null;

  createProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (id: string) => void;
};

const ShopContext = createContext<(ShopState & ShopActions) | null>(null);

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    setProducts(loadLocal<Product[]>(PRODUCTS_KEY, seedProducts));
    setCart(loadLocal<CartItem[]>(CART_KEY, []));
    setOrders(loadLocal<Order[]>(ORDERS_KEY, []));
  }, []);

  // Persist to localStorage
  useEffect(() => saveLocal(PRODUCTS_KEY, products), [products]);
  useEffect(() => saveLocal(CART_KEY, cart), [cart]);
  useEffect(() => saveLocal(ORDERS_KEY, orders), [orders]);

  const addToCart = useCallback((productId: string, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) {
        return prev.map((c) => (c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c));
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, quantity } : c)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback((): Order | null => {
    if (cart.length === 0) return null;
    const order: Order = {
      id: generateId('order'),
      createdAt: new Date().toISOString(),
      items: cart.map((c) => {
        const product = products.find((p) => p.id === c.productId)!;
        return { productId: c.productId, quantity: c.quantity, priceCentsAtPurchase: product.priceCents };
      }),
      totalCents: cart.reduce((sum, c) => {
        const product = products.find((p) => p.id === c.productId)!;
        return sum + product.priceCents * c.quantity;
      }, 0),
      status: 'pending',
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  }, [cart, products]);

  const createProduct = useCallback((product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = { ...product, id: generateId('p') };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Omit<Product, 'id'>>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
  }, []);

  const value = useMemo(
    () => ({
      products,
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      checkout,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, cart, orders, addToCart, removeFromCart, updateCartQuantity, clearCart, checkout, createProduct, updateProduct, deleteProduct]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
