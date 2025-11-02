"use client";

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';

export type FilterState = {
  query: string;
  category: string | 'All';
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sort: 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';
};

export function useFilteredProducts(products: Product[], filters: FilterState) {
  return useMemo(() => {
    let result = [...products];
    if (filters.category !== 'All') result = result.filter((p) => p.category === filters.category);
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    result = result.filter((p) => p.rating >= filters.minRating);
    result = result.filter((p) => p.priceCents >= filters.minPrice && p.priceCents <= filters.maxPrice);

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-desc':
        result.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
      default:
        break;
    }
    return result;
  }, [products, filters]);
}

export function Filters({
  products,
  onChange,
}: {
  products: Product[];
  onChange: (filters: FilterState) => void;
}) {
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const prices = useMemo(() => products.map((p) => p.priceCents), [products]);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 50000;

  const [state, setState] = useState<FilterState>({
    query: '',
    category: 'All',
    minPrice: min,
    maxPrice: max,
    minRating: 0,
    sort: 'relevance',
  });

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const next = { ...state, [key]: value };
    setState(next);
    onChange(next);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <input
        type="text"
        placeholder="Search products..."
        value={state.query}
        onChange={(e) => update('query', e.target.value)}
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
      />
      <select
        value={state.category}
        onChange={(e) => update('category', e.target.value as any)}
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <label className="text-sm whitespace-nowrap">Min $</label>
        <input
          type="number"
          value={(state.minPrice / 100).toFixed(0)}
          onChange={(e) => update('minPrice', Math.round(Number(e.target.value || '0') * 100))}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm whitespace-nowrap">Max $</label>
        <input
          type="number"
          value={(state.maxPrice / 100).toFixed(0)}
          onChange={(e) => update('maxPrice', Math.round(Number(e.target.value || '0') * 100))}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm whitespace-nowrap">Min Rating</label>
        <select
          value={state.minRating}
          onChange={(e) => update('minRating', Number(e.target.value))}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
        >
          {[0, 3, 4, 4.5].map((r) => (
            <option key={r} value={r}>
              {r}+
            </option>
          ))}
        </select>
      </div>
      <select
        value={state.sort}
        onChange={(e) => update('sort', e.target.value as any)}
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
      >
        <option value="relevance">Sort: Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Rating: High to Low</option>
        <option value="name-asc">Name: A ? Z</option>
      </select>
    </div>
  );
}
