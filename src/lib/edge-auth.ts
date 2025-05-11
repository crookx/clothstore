import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-fallback-secret-key-minimum-32-chars'
);

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { isValid: true, uid: payload.sub };
  } catch (error) {
    return { isValid: false, uid: null };
  }
}

export async function getAuthToken() {
  const token = (await cookies()).get('auth-token')?.value;
  if (!token) return null;
  return token;
}