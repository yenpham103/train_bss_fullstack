import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register'];

  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
