import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    
    // Set admin claim
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return new Response(JSON.stringify({ error: 'Failed to set admin claim' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}