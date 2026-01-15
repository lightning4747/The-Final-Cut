import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip redirect if already on the error page to avoid redirect loops
  const isErrorPage = request.nextUrl.pathname === "/supabase-error"

  // If Supabase is not configured, redirect to error page (unless already there)
  if ((!supabaseUrl || !supabaseAnonKey) && !isErrorPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/supabase-error"
    return NextResponse.redirect(url)
  }

  // If on error page and config is missing, just show it
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    // Refreshing the auth token
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Redirect unauthenticated users to sign-in (except for public routes)
    const publicRoutes = ["/", "/sign-in", "/sign-up", "/auth/callback", "/supabase-error"]
    const isPublicRoute = publicRoutes.some(
      (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith("/auth/"),
    )

    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/sign-in"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    // On any Supabase error (fetch failed, connection issues, etc.), redirect to error page
    if (!isErrorPage) {
      const url = request.nextUrl.clone()
      url.pathname = "/supabase-error"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }
}
