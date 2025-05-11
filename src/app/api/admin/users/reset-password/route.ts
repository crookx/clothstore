import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    await adminAuth.generatePasswordResetLink(userId);
    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    );
  }
}