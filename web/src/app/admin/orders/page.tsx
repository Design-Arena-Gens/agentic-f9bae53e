"use client";

import { useShop } from '@/contexts/ShopContext';
import { PriceDisplay } from '@/components/PriceDisplay';

export default function AdminOrders() {
  const { orders, products } = useShop();

  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-sm">No orders yet.</div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Order {o.id}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <ul className="mt-3 space-y-2">
              {o.items.map((it, idx) => {
                const p = products.find((pp) => pp.id === it.productId);
                if (!p) return null;
                return (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <div className="truncate">{p.name} ? {it.quantity}</div>
                    <PriceDisplay cents={it.priceCentsAtPurchase * it.quantity} />
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Status: {o.status}</div>
              <div className="font-medium"><PriceDisplay cents={o.totalCents} /></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
