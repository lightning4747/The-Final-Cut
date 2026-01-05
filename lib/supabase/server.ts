import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    "https://znrxtgejyygsnzvouslk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpucnh0Z2VqeXlnc256dm91c2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzEwNDgsImV4cCI6MjA4MTgwNzA0OH0.qJHc47pYevtv-KSAwyeZPFK0jKucoacRflxDSDHc6ZQ",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })
}
