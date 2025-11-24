import React from 'react'

function search({ searchTerm, setsearchTerm }) {
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="seacrh" />
            <input type="text" placeholder='search for a movie' 
            value={searchTerm}
            onChange={(event) => setsearchTerm(event.target.value)}/>
        </div>
    </div>
  )
}
  
export default search