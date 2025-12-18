import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import LoadingSpinner from './components/loading-spinner'
import { MovieCard, type Movie } from './components/movie-card'
import { getTrendingMovies, updateSearchCount } from './lib/appwrite'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined

const API_OPTIONS: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
  const [searchTerm, setsearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isloading, setisloading] = useState(false)
  const [movielist, setmovielist] = useState<Movie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<any[]>([])
  const [errormessage, seterrormessage] = useState('')

  const fetchMovies = async (query = '') => {
    setisloading(true)
    seterrormessage('')

    try {
      // query && query.trim().length > 0 is important, cause if the query is undefined then the trim will crash, trim only works on string.
      const endpoint =
        query && query.trim().length > 0
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/trending/movie/week`

      const response = await fetch(endpoint, API_OPTIONS) // server replies

      if (!response.ok) throw new Error('Failed to fetch movies')

      const data = await response.json() // converting it into the actual data and json takes time so need to use await
      const results: Movie[] = data.results || []
      setmovielist(results)

      // checks if the given word actually exists
      if (query && results.length > 0) {
        await updateSearchCount(query, results[0])
      }
    } catch (error) {
      console.error(error)
      seterrormessage('Error fetching movies')
    } finally {
      setisloading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      if (movies) {
        setTrendingMovies(movies)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Initial load: fetch trending movies
  useEffect(() => {
    fetchMovies('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load trending movies list from Appwrite
  useEffect(() => {
    loadTrendingMovies()
  }, [])

  // Debounce search term and fetch movies
  useDebounce(
    () => {
      fetchMovies(debouncedSearchTerm)
    },
    500,
    [debouncedSearchTerm]
  )

  // Update debounced value when user types
  useEffect(() => {
    setDebouncedSearchTerm(searchTerm)
  }, [searchTerm])

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="hero-banner" />
          <h1>
            Find <span className="text-gradient">movies</span> you'll enjoy
            without the hassle
          </h1>
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        {/* && is a javascript expression, so in order to use it the code must be enclosed with {} in jsx */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title || 'Movie'} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2>All Movies</h2>

          {isloading ? (
            <LoadingSpinner />
          ) : errormessage ? (
            <p className="text-red-500">{errormessage}</p>
          ) : (
            <ul>
              {movielist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App


