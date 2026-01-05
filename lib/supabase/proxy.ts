import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = "https://znrxtgejyygsnzvouslk.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpucnh0Z2VqeXlnc256dm91c2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzEwNDgsImV4cCI6MjA4MTgwNzA0OH0.qJHc47pYevtv-KSAwyeZPFK0jKucoacRflxDSDHc6ZQ"

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
    const publicRoutes = ["/", "/sign-in", "/sign-up", "/auth/callback"]
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
    // If there's an error, just continue without auth check
    console.error("[v0] Supabase proxy error:", error)
    return supabaseResponse
  }
}
