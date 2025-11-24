import React from 'react'

export const MovieCard = ({ movie }) => {
  const {
    title = 'Untitled',
    vote_average = 0,
    poster_path = null,
    release_date = '',
    original_language = ''
  } = movie || {}

  return (
    <div className='movie-card'>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : '/no-movie.png'
        }
        alt={title}
      />
      <div className='mt-4'>
        <h3>{title}</h3>
        <div className='content'>
          <div className='rating'>
            <img src="star.svg" alt="star icon" />
            <p>{vote_average.toFixed(1)}</p>
          </div>

          <span>*</span>
          <p className='lang'>{original_language.toUpperCase()}</p>
          <span>*</span>

          <p className='year'>
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
