import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/dashboard', '/admin/:path*'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;

  // Handle dashboard redirect first
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }  // Check auth for admin routes
  if (pathname.startsWith('/admin')) {
    const hasValidSession = sessionToken != null;
    if (!hasValidSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Allow access with token
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '-1');
    return response;
  }

  return NextResponse.next();
}
