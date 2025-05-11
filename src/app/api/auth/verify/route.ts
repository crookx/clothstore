import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = await cookieStore.get('auth-token');

  if (!token) {
    return new NextResponse(null, {
      status: 401,
      statusText: 'Unauthorized'
    });
  }

  return NextResponse.json({ status: 'authenticated' });
}