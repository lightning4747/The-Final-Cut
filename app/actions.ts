"use server"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.TMDB_API_KEY!

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
}

export async function fetchMovies(query = "") {
  if (!API_KEY) {
    return {
      results: [],
      error: "TMDB API key is not configured. Please add TMDB_API_KEY to your environment variables.",
    }
  }

  try {
    const endpoint =
      query && query.trim().length > 0
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/trending/movie/week`

    const response = await fetch(endpoint, API_OPTIONS)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 401) {
        return { results: [], error: "Invalid TMDB API key. Please check your TMDB_API_KEY environment variable." }
      }
      throw new Error(errorData.status_message || "Failed to fetch movies")
    }

    const data = await response.json()
    return { results: data.results || [], error: null }
  } catch (error) {
    console.error(error)
    return { results: [], error: "Error fetching movies. Please check your API configuration." }
  }
}

export async function fetchMovieDetails(movieId: string) {
  console.log("fetchMovieDetails called with ID:", movieId)
  if (!API_KEY) {
    console.error("API Key missing")
    return { movie: null, error: "TMDB API key is not configured." }
  }

  try {
    const movieUrl = `${API_BASE_URL}/movie/${movieId}?append_to_response=videos,images`
    const creditsUrl = `${API_BASE_URL}/movie/${movieId}/credits`

    console.log("Fetching:", movieUrl)

    const [movieResponse, creditsResponse] = await Promise.all([
      fetch(movieUrl, API_OPTIONS),
      fetch(creditsUrl, API_OPTIONS),
    ])

    console.log("Responses received:", {
      movieStatus: movieResponse.status,
      creditsStatus: creditsResponse.status
    })

    if (!movieResponse.ok) {
      if (movieResponse.status === 401) {
        return { movie: null, error: "Invalid TMDB API key." }
      }
      throw new Error(`Failed to fetch movie details: ${movieResponse.status}`)
    }

    const movie = await movieResponse.json()
    console.log("Movie JSON parsed, title:", movie?.title)

    // Explicitly type credits to avoid 'never[]' inference
    let credits: { cast: any[]; crew: any[] } = { cast: [], crew: [] }

    if (creditsResponse.ok) {
      const creditsData = await creditsResponse.json()
      credits = creditsData
      console.log("Credits JSON parsed")
    } else {
      console.warn("Credits fetch failed")
    }

    // Safety checks for arrays
    const cast = Array.isArray(credits.cast) ? credits.cast : []
    const crew = Array.isArray(credits.crew) ? credits.crew : []

    const result = {
      movie: {
        ...movie,
        cast: cast.slice(0, 10),
        director: crew.find((c: any) => c.job === "Director")?.name || "Unknown",
      },
      error: null,
    }

    console.log("Returning result successfully")
    return result
  } catch (error) {
    console.error("Error in fetchMovieDetails:", error)
    return { movie: null, error: "Error fetching movie details" }
  }
}

export async function fetchGenres() {
  if (!API_KEY) {
    return { genres: [], error: "TMDB API key is not configured." }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/genre/movie/list`, API_OPTIONS)

    if (!response.ok) {
      throw new Error("Failed to fetch genres")
    }

    const data = await response.json()
    return { genres: data.genres || [], error: null }
  } catch (error) {
    console.error(error)
    return { genres: [], error: "Error fetching genres" }
  }
}

export async function getRandomMovieSuggestion(genreId?: string) {
  if (!API_KEY) {
    return { movie: null, error: "TMDB API key is not configured." }
  }

  try {
    const page = Math.floor(Math.random() * 5) + 1
    const genreParam = genreId && genreId !== "all" ? `&with_genres=${genreId}` : ""

    const response = await fetch(
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}${genreParam}`,
      API_OPTIONS,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch random movie")
    }

    const data = await response.json()
    const results = data.results || []

    if (results.length === 0) {
      return { movie: null, error: "No movies found" }
    }

    const randomMovie = results[Math.floor(Math.random() * results.length)]
    return { movie: randomMovie, error: null }
  } catch (error) {
    console.error(error)
    return { movie: null, error: "Error fetching random movie" }
  }
}

export async function toggleFavorite(userId: string, movieId: string, movieData: any) {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()

  try {
    const { data: existing } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("movie_id", movieId)

      if (error) throw error
      return { success: true, action: "removed" }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: userId,
        movie_id: movieId,
        movie_title: movieData.title,
        poster_path: movieData.poster_path,
      })

      if (error) throw error
      return { success: true, action: "added" }
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { success: false, error: "Failed to update favorites" }
  }
}

export async function toggleWatchlist(userId: string, movieId: string, movieData: any) {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()

  try {
    const { data: existing } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase.from("watchlist").delete().eq("user_id", userId).eq("movie_id", movieId)

      if (error) throw error
      return { success: true, action: "removed" }
    } else {
      const { error } = await supabase.from("watchlist").insert({
        user_id: userId,
        movie_id: movieId,
        movie_title: movieData.title,
        poster_path: movieData.poster_path,
      })

      if (error) throw error
      return { success: true, action: "added" }
    }
  } catch (error) {
    console.error("Error toggling watchlist:", error)
    return { success: false, error: "Failed to update watchlist" }
  }
}

export async function checkMovieStatus(userId: string, movieId: string) {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()

  try {
    const [favoriteResult, watchlistResult] = await Promise.all([
      supabase.from("favorites").select("*").eq("user_id", userId).eq("movie_id", movieId).maybeSingle(),
      supabase.from("watchlist").select("*").eq("user_id", userId).eq("movie_id", movieId).maybeSingle(),
    ])

    return {
      isFavorite: !!favoriteResult.data,
      isInWatchlist: !!watchlistResult.data,
    }
  } catch (error) {
    console.error("Error checking movie status:", error)
    return { isFavorite: false, isInWatchlist: false }
  }
}
