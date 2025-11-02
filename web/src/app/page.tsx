"use client";

import { useMemo, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import { Filters, type FilterState, useFilteredProducts } from "@/components/Filters";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { products } = useShop();
  const [filters, setFilters] = useState<FilterState | null>(null);
  const min = useMemo(() => (products.length ? Math.min(...products.map(p => p.priceCents)) : 0), [products]);
  const max = useMemo(() => (products.length ? Math.max(...products.map(p => p.priceCents)) : 50000), [products]);
  const applied = filters ?? { query: "", category: "All", minPrice: min, maxPrice: max, minRating: 0, sort: "relevance" as const };
  const filtered = useFilteredProducts(products, applied);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Product Selection</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Discover products and add them to your cart.</p>
        </div>
      </div>
      <Filters products={products} onChange={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
