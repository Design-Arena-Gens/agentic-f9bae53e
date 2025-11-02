"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Developer Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-sm underline">Products</Link>
          <Link href="/admin/orders" className="text-sm underline">Orders</Link>
          <button onClick={logout} className="text-sm underline">Logout</button>
        </div>
      </div>
      {children}
    </div>
  );
}
