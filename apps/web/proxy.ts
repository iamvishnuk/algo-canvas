import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/confirm-account',
  '/forgot-password',
  '/reset-password',
  '/verify-mfa'
];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the path matches any of the public routes
  const isPublicRoute = publicRoutes.some((route) => path === route);

  const accessToken = req.cookies.get('accessToken')?.value;

  console.log('Proxy Running on:', path);
  console.log('AccessToken:', accessToken);

  if (path === '/') return NextResponse.next();

  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
