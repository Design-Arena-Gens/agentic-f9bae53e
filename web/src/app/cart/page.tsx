"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/contexts/ShopContext';
import { PriceDisplay } from '@/components/PriceDisplay';

export default function CartPage() {
  const { cart, products, updateCartQuantity, removeFromCart, checkout } = useShop();

  const items = cart.map((c) => ({
    ...c,
    product: products.find((p) => p.id === c.productId)!,
  }));
  const subtotal = items.reduce((s, i) => s + i.product.priceCents * i.quantity, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Your Cart</h1>
      {items.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-sm">
          Your cart is empty. <Link href="/" className="underline">Browse products</Link>.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((i) => (
              <div key={i.productId} className="flex items-center gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="relative w-24 h-20 rounded-lg overflow-hidden">
                  <Image src={i.product.image} alt={i.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{i.product.name}</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    <PriceDisplay cents={i.product.priceCents} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={i.quantity}
                    onChange={(e) => updateCartQuantity(i.productId, Math.max(1, Number(e.target.value || '1')))}
                    className="w-16 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1 text-sm"
                  />
                  <button onClick={() => removeFromCart(i.productId)} className="text-sm underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 h-max">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Subtotal</span>
              <PriceDisplay cents={subtotal} className="font-medium" />
            </div>
            <button
              onClick={() => checkout()}
              className="mt-4 w-full rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
