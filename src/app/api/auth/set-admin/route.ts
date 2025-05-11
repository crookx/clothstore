import { adminAuth } from '@/lib/firebase/admin-edge';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    
    // Set admin claim
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    
    // Verify the claims were set
    const user = await adminAuth.getUser(uid);
    console.log('Admin claims set:', user.customClaims);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error setting admin claims:', error);
    return Response.json({ success: false, error: 'Failed to set admin claims' });
  }
}