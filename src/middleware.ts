import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserRole } from '@/db/enums';

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const url = req.nextUrl.pathname;

  if (user) {
    const userRoleFromMetadata = user.user_metadata?.role;
    console.log('User role from metadata:', userRoleFromMetadata);

    // Check Auth
    if (url.startsWith('/auth') && user) {
      if (userRoleFromMetadata === UserRole.ADMIN) {
        const redirectUrl = new URL('/admin', req.url);
        return NextResponse.redirect(redirectUrl);
      } else if (userRoleFromMetadata === UserRole.STAFF) {
        const redirectUrl = new URL('/staff', req.url);
        return NextResponse.redirect(redirectUrl);
      } else {
        const redirectUrl = new URL('/', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Check admin access
    if (url.startsWith('/admin') && userRoleFromMetadata !== UserRole.ADMIN) {
      const redirectUrl = new URL('/unauthorized', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    if(url == "/" && userRoleFromMetadata === UserRole.ADMIN) {
      const redirectUrl = new URL('/admin', req.url);
      return NextResponse.redirect(redirectUrl);
    }


    // Check staff access
    if (!url.startsWith('/admin') && userRoleFromMetadata !== UserRole.STAFF) {
      const redirectUrl = new URL('/unauthorized', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  } else {
    // User is not authenticated, redirect to sign-in for protected routes
    if (url.startsWith('/admin')) {
      const redirectUrl = new URL('/auth/sign-in', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
