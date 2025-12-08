import { useEffect, useState } from 'react'
import Search from './components/Search'
import LoadingSpinner from './components/LoadingSpinner'
import { MovieCard } from './components/MovieCard'
import { useDebounce } from 'react-use'

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setsearchTerm] = useState('')
  const [errormessage, seterrormessage] = useState('')
  const [movielist, setmovielist] = useState([])
  const [isloading, setisloading] = useState(false)
  const [debounce, setDebounce] = useDebounce(searchTerm, 500)

  const fetchMovies = async (query = '') => {
    setisloading(true)
    seterrormessage('')

    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc` ;

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) throw new Error('Failed to fetch movies')

      const data = await response.json()
      setmovielist(data.results || [])
    } catch (error) {
      console.error(error)
      seterrormessage("Error fetching movies")
    } finally {
      setisloading(false)
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm);
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

        <section className="all-movies">
          <h2 className="mt-[40px]">All movies</h2>

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
