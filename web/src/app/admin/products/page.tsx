"use client";

import { useMemo, useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { PriceDisplay } from '@/components/PriceDisplay';

export default function AdminProducts() {
  const { products, createProduct, updateProduct, deleteProduct } = useShop();
  const [form, setForm] = useState({
    name: '',
    description: '',
    priceCents: 0,
    image: '',
    category: '',
    rating: 4.0,
  });

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  function reset() {
    setForm({ name: '', description: '', priceCents: 0, image: '', category: '', rating: 4.0 });
  }

  function create() {
    if (!form.name || !form.image || !form.category) return;
    createProduct({ ...form, specs: [] });
    reset();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
        <h2 className="font-semibold mb-3">Create Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} list="catlist" />
          <datalist id="catlist">{categories.map(c => <option key={c} value={c} />)}</datalist>
          <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm" placeholder="Price (USD)" type="number" value={(form.priceCents/100).toFixed(0)} onChange={(e) => setForm({ ...form, priceCents: Math.round(Number(e.target.value || '0') * 100) })} />
          <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm md:col-span-2 lg:col-span-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button onClick={create} className="rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-2 text-sm font-medium hover:opacity-90 transition w-max">Add Product</button>
        </div>
      </div>

      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="grid grid-cols-1 lg:grid-cols-6 items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="font-medium truncate lg:col-span-2">{p.name}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{p.category}</div>
            <div className="text-sm"><PriceDisplay cents={p.priceCents} /></div>
            <div className="flex gap-2 lg:justify-end lg:col-span-2">
              <button onClick={() => updateProduct(p.id, { priceCents: p.priceCents + 500 })} className="text-sm underline">+ $5</button>
              <button onClick={() => updateProduct(p.id, { priceCents: Math.max(0, p.priceCents - 500) })} className="text-sm underline">- $5</button>
              <button onClick={() => deleteProduct(p.id)} className="text-sm text-red-600 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
