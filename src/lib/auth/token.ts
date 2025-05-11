import { getAuth } from 'firebase-admin/auth';
const auth = getAuth();

export interface DecodedToken {
  uid: string;
  email: string;
  isAdmin: boolean;
}

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function verifyToken(token: string): Promise<DecodedToken> {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const isAdmin = decodedToken.admin === true; // Check for the 'admin' claim directly
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      isAdmin // This will now correctly reflect the 'admin: true' claim
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new AuthError('Invalid token', 'auth/invalid-token');
  }
}

export async function verifyAdminToken(token: string): Promise<DecodedToken> {
  const decodedToken = await verifyToken(token);
  if (!decodedToken.isAdmin) {
    throw new AuthError('Not authenticated as admin', 'auth/insufficient-permissions');
  }
  return decodedToken;
}

export const verifySessionToken = async (sessionCookie: string): Promise<DecodedToken> => {
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const isAdmin = decodedClaims.admin === true; // Check for the 'admin' claim directly
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email || '',
      isAdmin // This will now correctly reflect the 'admin: true' claim
    };
  } catch (error) {
    console.error('Error verifying session token:', error);
    throw new AuthError('Invalid session token', 'auth/invalid-session');
  }
};

export const verifyAdminSessionToken = async (sessionCookie: string): Promise<DecodedToken> => {
  const decodedToken = await verifySessionToken(sessionCookie);
  if (!decodedToken.isAdmin) {
    throw new AuthError('Not authenticated as admin', 'auth/insufficient-permissions');
  }
  return decodedToken;
};