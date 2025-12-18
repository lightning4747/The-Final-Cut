import { Client, Databases, ID, Query, type Models } from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID as string
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID as string
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT as string

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)

const database = new Databases(client)

type MovieForMetrics = {
  id: number
  poster_path?: string | null
}

export const updateSearchCount = async (
  searchTerm: string,
  movie: MovieForMetrics
) => {
  try {
    // Using Appwrite's current Databases API; this call shape is still supported
    // even though one of the older TypeScript overloads is marked as deprecated.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - suppress deprecation warning for this overload in JS/TS
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('searchTerm', searchTerm)]
    )

    if (result.documents.length > 0) {
      const doc = result.documents[0]

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc.count as number) + 1,
      })
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        movie_id: movie.id,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export const getTrendingMovies = async (): Promise<Models.Document[] | void> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(5), Query.orderDesc('count')]
    )

    return result.documents
  } catch (error) {
    console.log(error)
  }
}


