import type { ChangeEvent } from 'react'

type SearchProps = {
  searchTerm: string
  setsearchTerm: (value: string) => void
}

export default function Search({ searchTerm, setsearchTerm }: SearchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setsearchTerm(event.target.value)
  }

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="search for a movie"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}


