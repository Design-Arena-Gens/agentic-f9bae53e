"use client";

import Link from 'next/link';
import { ShoppingCart, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useShop } from '@/contexts/ShopContext';
import { useMemo } from 'react';

export function Header() {
  const { cart } = useShop();
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          NovaStore
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black px-1.5 text-xs">{cartCount}</span>
            )}
          </Link>
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Shield size={16} />
            <span className="hidden sm:inline">Developer</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
