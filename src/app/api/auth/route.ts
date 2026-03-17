import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = body?.userId;

  if (typeof userId !== 'string' || userId.length === 0) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const store = await cookies();
  store.set('challenge-user-id', userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete('challenge-user-id');
  return NextResponse.json({ success: true });
}
