"use client"

import type React from "react"

import { Heart, Bookmark, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toggleFavorite, toggleWatchlist, checkMovieStatus } from "@/app/actions"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Movie {
  id?: number
  title?: string
  vote_average?: number
  poster_path?: string | null
  release_date?: string
  original_language?: string
}

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const {
    id,
    title = "Untitled",
    vote_average = 0,
    poster_path = null,
    release_date = "",
    original_language = "",
  } = movie || {}

  const year = release_date ? release_date.split("-")[0] : "N/A"
  const rating = vote_average.toFixed(1)

  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [isTogglingWatchlist, setIsTogglingWatchlist] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const isConfigured = isSupabaseConfigured()
  const supabase = isConfigured ? createClient() : null

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const loadUserAndStatus = async () => {
      if (!supabase || !id) return

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const status = await checkMovieStatus(user.id, id.toString())
          setIsFavorite(status.isFavorite)
          setIsInWatchlist(status.isInWatchlist)
        }
      } catch (error) {
        console.error("Error loading user status:", error)
      }
    }

    loadUserAndStatus()
  }, [supabase, id])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user || isTogglingFavorite) return

    setIsTogglingFavorite(true)

    try {
      const result = await toggleFavorite(user.id, id!.toString(), {
        title,
        poster_path,
      })

      if (result.success) {
        setIsFavorite(result.action === "added")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user || isTogglingWatchlist) return

    setIsTogglingWatchlist(true)

    try {
      const result = await toggleWatchlist(user.id, id!.toString(), {
        title,
        poster_path,
      })

      if (result.success) {
        setIsInWatchlist(result.action === "added")
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error)
    } finally {
      setIsTogglingWatchlist(false)
    }
  }

  return (
    <Link href={`/movie/${id}`}>
      <div
        ref={cardRef}
        className={`group cursor-pointer transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-all duration-300 group-hover:duration-200" />

          <div className="relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 group-hover:border-transparent">
            {/* Poster Image */}
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Rating Badge */}
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-white">{rating}</span>
            </div>

            {user && (
              <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handleFavoriteClick}
                  disabled={isTogglingFavorite}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                    isFavorite ? "bg-red-500/90 text-white" : "bg-black/70 text-white hover:bg-red-500/90"
                  }`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </button>

                <button
                  onClick={handleWatchlistClick}
                  disabled={isTogglingWatchlist}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                    isInWatchlist ? "bg-blue-500/90 text-white" : "bg-black/70 text-white hover:bg-blue-500/90"
                  }`}
                  title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  <Bookmark className={`w-4 h-4 ${isInWatchlist ? "fill-current" : ""}`} />
                </button>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="text-white text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                View Details
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <h3 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{year}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="uppercase">{original_language}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
