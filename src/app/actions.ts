"use server"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.TMDB_API_KEY

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
}

export async function fetchMovies(query = "") {
  try {
    const endpoint =
      query && query.trim().length > 0
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/trending/movie/week`

    const response = await fetch(endpoint, API_OPTIONS)

    if (!response.ok) throw new Error("Failed to fetch movies")

    const data = await response.json()
    return { results: data.results || [], error: null }
  } catch (error) {
    console.error(error)
    return { results: [], error: "Error fetching movies" }
  }
}
