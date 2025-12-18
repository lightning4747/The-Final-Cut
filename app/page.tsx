"use client"

import { useEffect, useState, useRef } from "react"
import { Search, Film, TrendingUp, Star } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import { useDebounce } from "react-use"
import { getTrendingMovies, updateSearchCount } from "@/lib/appwrite"
import { fetchMovies } from "./actions"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [movieList, setMovieList] = useState<any[]>([])
  const [trendingMovies, setTrendingMovies] = useState<any[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  const loadMovies = async (query = "") => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const { results, error } = await fetchMovies(query)

      if (error) {
        setErrorMessage(error)
      } else {
        setMovieList(results)
        if (query && results.length > 0) {
          await updateSearchCount(query, results[0])
        }
      }
    } catch (error) {
      console.error(error)
      setErrorMessage("Error fetching movies")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadMovies("")
  }, [])

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  useDebounce(
    () => {
      loadMovies(debouncedSearchTerm)
    },
    1000,
    [debouncedSearchTerm],
  )

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    setHeaderVisible(true)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6">
            <Film className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Discover Amazing Films</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight text-balance">
            Find <span className="text-gradient">Movies</span> You{"'"}ll Love
          </h1>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Search through thousands of movies and discover your next favorite film
          </p>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur-xl opacity-0 group-focus-within:opacity-50 transition-all duration-500" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-all duration-300" />
              <div className="relative flex items-center bg-secondary/90 backdrop-blur-sm border border-border rounded-xl overflow-hidden transition-all duration-300 group-focus-within:border-transparent group-focus-within:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <Search className="w-5 h-5 text-muted-foreground ml-4 transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="Search for a movie..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setIsSearching(e.target.value.length > 0)
                  }}
                  className="w-full bg-transparent py-4 px-4 text-foreground placeholder-muted-foreground outline-none text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setIsSearching(false)
                    }}
                    className="mr-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="sr-only">Clear search</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Trending Section */}
        {trendingMovies.length > 0 && !isSearching && (
          <section className="mb-12 sm:mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Trending Now</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              {trendingMovies.map((movie, index) => (
                <div key={movie.$id} className="relative flex-shrink-0 group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={movie.poster_url || "/placeholder.svg?height=200&width=140&query=movie poster"}
                      alt={movie.title}
                      className="w-32 sm:w-40 h-48 sm:h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-medium text-sm line-clamp-1">{movie.title}</p>
                    </div>
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Movies Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {searchTerm ? `Results for "${searchTerm}"` : "Popular Movies"}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-secondary rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-muted-foreground">Loading movies...</p>
            </div>
          ) : errorMessage ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-destructive font-medium">{errorMessage}</p>
            </div>
          ) : movieList.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <Film className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No movies found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
