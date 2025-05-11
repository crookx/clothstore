import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, number[]>();

export async function rateLimiter(request: NextRequest) {
  // Get IP from headers or forwarded header
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'anonymous';
             
  const now = Date.now();
  const windowStart = now - 15 * 60 * 1000; // 15 minutes ago

  const requestTimestamps = rateLimit.get(ip) || [];
  const requestsInWindow = requestTimestamps.filter((timestamp: number) => timestamp > windowStart);

  if (requestsInWindow.length >= 100) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  requestsInWindow.push(now);
  rateLimit.set(ip, requestsInWindow);

  return NextResponse.next();
}

// Middleware for API routes
export async function middleware(request: NextRequest) {
  // Apply to all API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      await rateLimiter(request);
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};