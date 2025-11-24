import { useEffect,useState } from 'react'
import Search from './components/search'
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setsearchTerm] = useState('');
  const [errormessage, seterrormessage] = useState('');
  const [movielist, setmovielist] = useState([]);
  const [isloading,setisloading] = useState(true);

  const fetchMovies = async() => {
    setisloading(true);
    seterrormessage('');

    try {
      const endpoints = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoints, API_OPTIONS);
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if(data.response ==='False') {
        seterrormessage(data.Error  || 'Failed to fetch movies');
        setmovielist([]);
        return;
      }
      setmovielist(data.results ||[]);
    }
    
    catch(error) {
      console.error(error);
      seterrormessage("Error fetching movies");
    }

    finally {
      setisloading(true);
    }
  }
  useEffect(()=> {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className='pattern'></div>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="hero-banner" />
          <h1>Find <span className='text-gradient'>movies</span> you'll enjoy without the hassle</h1>
        <Search searchTerm= {searchTerm} setsearchTerm={setsearchTerm}/>
        </header>

        <section className='all-movies'>
        <h2>All movies</h2>

       {isloading ? (
        <LoadingSpinner/>
       ): errormessage ? (
        <p className='text-white'>{errormessage}</p>
       ) : (
        <ul>
          {movielist.map((movie) => (
            <p key={movie.id} className='text-white'>{movie.title}</p>
          ))}
        </ul>
       )}
        </section> 
       
      </div>
    </main>
  )
}

export default App