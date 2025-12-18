import { Client, Databases, ID, Query } from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || ""
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ""
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm: string, movie: any) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("searchTerm", searchTerm)])

    if (result.documents.length > 0) {
      const doc = result.documents[0]

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc as any).count + 1,
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

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(5), Query.orderDesc("count")])

    return result.documents
  } catch (error) {
    console.log(error)
    return []
  }
}
