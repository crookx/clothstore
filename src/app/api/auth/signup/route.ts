import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });

    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create account' 
    }, { status: 400 });
  }
}