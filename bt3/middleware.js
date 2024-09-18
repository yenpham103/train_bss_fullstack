import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware executed for:', request.url);

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
