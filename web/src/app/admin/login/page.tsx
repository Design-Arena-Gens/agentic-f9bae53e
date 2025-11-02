"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || 'Authentication failed');
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950">
      <h1 className="text-xl font-semibold mb-4">Developer Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          Sign in
        </button>
      </form>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">Default password: <code>admin12345</code> (override with env <code>ADMIN_PASSWORD</code>).</p>
    </div>
  );
}
