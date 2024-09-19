import { NextResponse } from 'next/server';
export function middleware(request) {
  const response = NextResponse.next();
  const nextUrl = request.nextUrl;
  response.headers.set('x-pathname', nextUrl.pathname);
  response.headers.set('x-search', nextUrl.search);
  return response;
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
