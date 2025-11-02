import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  const expected = process.env.ADMIN_PASSWORD || 'admin12345';
  if (password === expected) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_auth', '1', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
    return res;
  }
  return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
}
