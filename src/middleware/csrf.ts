import Tokens from 'csrf';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const tokens = new Tokens();
const secret = process.env.CSRF_SECRET || 'your-secret-key';

export async function csrfMiddleware(request: NextRequest) {
  if (request.method === 'GET') {
    const token = tokens.create(secret);
    const response = NextResponse.next();
    response.headers.set('X-CSRF-Token', token);
    return response;
  }

  const token = request.headers.get('X-CSRF-Token');
  if (!token || !tokens.verify(secret, token)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  return NextResponse.next();
}