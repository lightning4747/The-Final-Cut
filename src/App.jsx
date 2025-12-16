import { useEffect, useState } from 'react'
import Search from './components/Search'
import LoadingSpinner from './components/LoadingSpinner'
import { MovieCard } from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
  const [searchTerm, setsearchTerm] = useState('')
  const [errormessage, seterrormessage] = useState('')
  const [movielist, setmovielist] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isloading, setisloading] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const fetchMovies = async (query = '') => {
    setisloading(true)
    seterrormessage('')

    try {
      // When there is no search term, show trending movies by default
      const endpoint =
        query && query.trim().length > 0
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/trending/movie/week`

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) throw new Error('Failed to fetch movies')

      const data = await response.json()
      const results = data.results || []
      setmovielist(results)

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

  const loadTrendingMovies = async ()=> {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }
    catch(error) {
      console.log(error)
    }
  }

  // Initial load: fetch trending movies
  useEffect(() => {
    fetchMovies('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            Find <span className="text-gradient">movies</span> you'll enjoy without the hassle
          </h1>
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
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
