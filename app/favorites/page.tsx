"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Film, ArrowLeft } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const isConfigured = isSupabaseConfigured()
  const supabase = isConfigured ? createClient() : null

  useEffect(() => {
    const loadFavorites = async () => {
      if (!supabase) {
        setIsLoading(false)
        return
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (!user) {
          router.push("/sign-in")
          return
        }

        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        const movies = data.map((fav:any) => ({
          id: Number.parseInt(fav.movie_id),
          title: fav.movie_title,
          poster_path: fav.poster_path,
        }))

        setFavorites(movies)
      } catch (error) {
        console.error("Error loading favorites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [supabase, router])

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <Link href="/browse">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"} in your favorites
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-secondary rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-muted-foreground">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">Start adding movies to your favorites!</p>
            <Link href="/browse">
              <Button>
                <Film className="w-4 h-4 mr-2" />
                Browse Movies
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
