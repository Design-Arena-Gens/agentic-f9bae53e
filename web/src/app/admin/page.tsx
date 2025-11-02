"use client";

import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Link href="/admin/products" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition">
        <h2 className="font-semibold mb-1">Manage Products</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Create, edit, and delete products.</p>
      </Link>
      <Link href="/admin/orders" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition">
        <h2 className="font-semibold mb-1">Manage Orders</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">View and update order statuses.</p>
      </Link>
    </div>
  );
}
