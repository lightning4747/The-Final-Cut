import { fetchMovieDetails } from "@/app/actions"
import { ArrowLeft, Star, Clock, Calendar, Globe, Play } from "lucide-react"
import Link from "next/link"

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { movie, error } = await fetchMovieDetails(id)

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">{error || "Movie not found"}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")

  return (
    <main className="min-h-screen bg-background">
      {/* Backdrop */}
      <div className="fixed inset-0 z-0">
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Movies
          </Link>
        </div>

        {/* Movie Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-300" />
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-movie.png"}
                  alt={movie.title}
                  className="relative w-64 sm:w-80 rounded-xl shadow-2xl"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 text-balance">
                  {movie.title}
                </h1>
                {movie.tagline && <p className="text-lg text-muted-foreground italic">"{movie.tagline}"</p>}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 rounded-full">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-amber-400">{movie.vote_average?.toFixed(1)}</span>
                </div>
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                {movie.original_language && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="uppercase">{movie.original_language}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full border border-border"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Trailer Button */}
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Trailer
                </a>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{movie.overview || "No overview available."}</p>
              </div>

              {/* Director */}
              {movie.director && movie.director !== "Unknown" && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Director</h3>
                  <p className="text-foreground font-medium">{movie.director}</p>
                </div>
              )}

              {/* Cast */}
              {movie.cast?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Cast</h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {movie.cast.map((actor: any) => (
                      <div key={actor.id} className="flex-shrink-0 text-center w-24">
                        <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-secondary">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                : "/actor-portrait.png"
                            }
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{actor.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
