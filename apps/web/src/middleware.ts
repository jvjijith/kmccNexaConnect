import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - manifest.json (manifest file)
       * - mc-icon-white.svg (logo)
       * - mc-icon.svg (logo)
       * - img/* (static images)
       */
      '/((?!api|_next/static|_next/image|robots.txt|sitemap.xml|manifest.json|site.webmanifest|browserconfig.xml|.*.ico$|.*.svg$|.*.png$|.*.jpg$|.*.jpeg$).*)'
    ]}