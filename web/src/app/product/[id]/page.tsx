"use client";

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { PriceDisplay } from '@/components/PriceDisplay';
import { RatingStars } from '@/components/RatingStars';

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const { products, addToCart } = useShop();
  const product = useMemo(() => products.find((p) => p.id === params.id), [products, params.id]);
  if (!product) return notFound();

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 hover:scale-110 cursor-zoom-in"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
              <div className="mt-1"><RatingStars rating={product.rating} /></div>
            </div>
            <PriceDisplay cents={product.priceCents} className="text-xl font-semibold" />
          </div>
          <p className="text-zinc-700 dark:text-zinc-300">{product.description}</p>
          <div>
            <h2 className="font-medium mb-2">Specifications</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.specs.map((s, i) => (
                <li key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">{s.label}: </span>
                  <span>{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => addToCart(product.id, 1)}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Add to Cart
            </button>
            <Link href="/cart" className="inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
              Go to Cart
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/product/${r.id}`} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image src={r.image} alt={r.name} fill className="object-cover" />
                </div>
                <div className="mt-2 text-sm font-medium truncate">{r.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
