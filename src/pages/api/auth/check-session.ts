import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySession } from '@/lib/auth/server'; // Adjust path as needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const decodedClaims = await verifySession(); // verifySession uses next/headers, which works in API routes
    return res.status(200).json({ user: decodedClaims });
  } catch (error) {
    console.error('API check-session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}