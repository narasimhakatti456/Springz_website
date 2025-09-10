import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Protect admin routes
    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL('/auth/signin?error=AccessDenied', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
        const isApiRoute = req.nextUrl.pathname.startsWith('/api')

        // Allow access to auth pages and API routes
        if (isAuthPage || isApiRoute) {
          return true
        }

        // Require authentication for admin pages
        if (isAdminPage) {
          return !!token
        }

        // Allow access to public pages
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/profile/:path*', '/checkout/:path*']
}

