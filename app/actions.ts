"use server"

const API_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_ACCESS_TOKEN = process.env.TMDB_API_KEY! // rename env later if you want

if (!TMDB_ACCESS_TOKEN) {
  throw new Error("TMDB access token missing")
}

const API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
}

/* ----------------------------- Types ----------------------------- */

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface Crew {
  id: number
  name: string
  job: string
}

/* ------------------------- TMDB Actions --------------------------- */

export async function fetchMovies(query = ""): Promise<{
  results: Movie[]
  error: string | null
}> {
  try {
    const endpoint = query.trim()
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/trending/movie/week`

    const res = await fetch(endpoint, {
      ...API_OPTIONS,
      next: { revalidate: 600 },
    })

    if (!res.ok) {
      if (res.status === 401) {
        return { results: [], error: "Invalid TMDB token" }
      }
      throw new Error("Failed to fetch movies")
    }

    const data = await res.json()
    return { results: data.results ?? [], error: null }
  } catch {
    return { results: [], error: "Movie fetch failed" }
  }
}

export async function fetchMovieDetails(movieId: string): Promise<{
  movie: (Movie & {
    cast: Cast[]
    director: string
    videos?: any
    images?: any
  }) | null
  error: string | null
}> {
  try {
    const [movieRes, creditsRes] = await Promise.all([
      fetch(
        `${API_BASE_URL}/movie/${movieId}?append_to_response=videos,images`,
        { ...API_OPTIONS, next: { revalidate: 3600 } }
      ),
      fetch(`${API_BASE_URL}/movie/${movieId}/credits`, {
        ...API_OPTIONS,
        next: { revalidate: 3600 },
      }),
    ])

    if (!movieRes.ok) {
      return { movie: null, error: "Movie not found" }
    }

    const movie = await movieRes.json()

    let cast: Cast[] = []
    let director = "Unknown"

    if (creditsRes.ok) {
      const credits = await creditsRes.json()
      cast = (credits.cast ?? []).slice(0, 10)
      director =
        credits.crew?.find((c: Crew) => c.job === "Director")?.name ??
        "Unknown"
    }

    return {
      movie: {
        ...movie,
        cast,
        director,
      },
      error: null,
    }
  } catch {
    return { movie: null, error: "Failed to fetch movie details" }
  }
}

export async function fetchGenres(): Promise<{
  genres: { id: number; name: string }[]
  error: string | null
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/genre/movie/list`, {
      ...API_OPTIONS,
      next: { revalidate: 86400 },
    })

    if (!res.ok) throw new Error()

    const data = await res.json()
    return { genres: data.genres ?? [], error: null }
  } catch {
    return { genres: [], error: "Failed to fetch genres" }
  }
}

export async function getRandomMovieSuggestion(
  genreId?: string
): Promise<{ movie: Movie | null; error: string | null }> {
  try {
    const genre =
      genreId && genreId !== "all" ? `&with_genres=${genreId}` : ""

    for (let attempt = 0; attempt < 2; attempt++) {
      const page = Math.floor(Math.random() * 10) + 1

      const res = await fetch(
        `${API_BASE_URL}/discover/movie` +
          `?language=en-US` +
          `&include_adult=false` +
          `&vote_count.gte=100` +
          `&sort_by=popularity.desc` +
          `&page=${page}` +
          genre,
        {
          ...API_OPTIONS,
          next: { revalidate: 300 },
        }
      )

      if (!res.ok) continue

      const data = await res.json()
      const results: Movie[] = data.results ?? []

      if (results.length > 0) {
        const randomMovie =
          results[Math.floor(Math.random() * results.length)]
        return { movie: randomMovie, error: null }
      }
    }

    return { movie: null, error: "No suitable movie found" }
  } catch {
    return { movie: null, error: "Random suggestion failed" }
  }
}





/* ------------------------ Supabase Actions ------------------------- */

async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server")
  return createClient()
}

export async function toggleFavorite(
  userId: string,
  movie: Movie
): Promise<{ success: boolean; action?: "added" | "removed"; error?: string }> {
  try {
    const supabase = await getSupabase()

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("movie_id", movie.id)
      .maybeSingle()

    if (data) {
      await supabase.from("favorites").delete().eq("id", data.id)
      return { success: true, action: "removed" }
    }

    await supabase.from("favorites").insert({
      user_id: userId,
      movie_id: movie.id,
      movie_title: movie.title,
      poster_path: movie.poster_path,
    })

    return { success: true, action: "added" }
  } catch {
    return { success: false, error: "Favorite update failed" }
  }
}

export async function toggleWatchlist(
  userId: string,
  movie: Movie
): Promise<{ success: boolean; action?: "added" | "removed"; error?: string }> {
  try {
    const supabase = await getSupabase()

    const { data } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", userId)
      .eq("movie_id", movie.id)
      .maybeSingle()

    if (data) {
      await supabase.from("watchlist").delete().eq("id", data.id)
      return { success: true, action: "removed" }
    }

    await supabase.from("watchlist").insert({
      user_id: userId,
      movie_id: movie.id,
      movie_title: movie.title,
      poster_path: movie.poster_path,
    })

    return { success: true, action: "added" }
  } catch {
    return { success: false, error: "Watchlist update failed" }
  }
}

export async function checkMovieStatus(
  userId: string,
  movieId: string
): Promise<{ isFavorite: boolean; isInWatchlist: boolean }> {
  try {
    const supabase = await getSupabase()

    const [fav, watch] = await Promise.all([
      supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("movie_id", movieId)
        .maybeSingle(),
      supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", userId)
        .eq("movie_id", movieId)
        .maybeSingle(),
    ])

    return {
      isFavorite: !!fav.data,
      isInWatchlist: !!watch.data,
    }
  } catch {
    return { isFavorite: false, isInWatchlist: false }
  }
}
