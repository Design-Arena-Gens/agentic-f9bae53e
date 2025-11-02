"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { PriceDisplay } from './PriceDisplay';
import { RatingStars } from './RatingStars';
import { useShop } from '@/contexts/ShopContext';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/product/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-[4/3]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight">
              <Link href={`/product/${product.id}`} className="hover:underline">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{product.description}</p>
          </div>
          <PriceDisplay cents={product.priceCents} className="font-semibold" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <RatingStars rating={product.rating} />
          <button
            onClick={() => addToCart(product.id, 1)}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-1.5 text-sm hover:opacity-90 transition-opacity"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}
