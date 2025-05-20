// app/api/tmdb/trending/route.ts
import { NextResponse } from 'next/server';
import { TmdbContentItem, TmdbApiListResponse } from '@/types/tmdb';
import type { TmdbGenre, TmdbDetailedResponse as TmdbListItem } from '@/types/tmdb-api';
import { getTmdbImageUrl, getTmdbApiUrl, TMDB_API_KEY, TMDB_BASE_URL } from '@/utils/tmdb-api-helpers';

const movieGenresMap = new Map<number, string>();
const tvGenresMap = new Map<number, string>();

/**
 * Fetches and caches movie and TV genre mappings from the TMDB API if not already loaded.
 *
 * @remark
 * If the TMDB API key is missing, the function returns early without attempting to fetch genres.
 */
async function fetchGenres() {
  if (!TMDB_API_KEY) return; 
  if (movieGenresMap.size === 0) {
    try {
      const res = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
      if (res.ok) {
        const data: { genres: TmdbGenre[] } = await res.json();
        data.genres.forEach((genre: TmdbGenre) => movieGenresMap.set(genre.id, genre.name));
      }
    } catch (e) { console.error("Failed to fetch movie genres", e); }
  }
  if (tvGenresMap.size === 0) {
     try {
      const res = await fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}`);
      if (res.ok) {
        const data: { genres: TmdbGenre[] } = await res.json();
        data.genres.forEach((genre: TmdbGenre) => tvGenresMap.set(genre.id, genre.name));
      }
    } catch (e) { console.error("Failed to fetch TV genres", e); }
  }
}

type TmdbTrendingListItem = TmdbListItem & {
  media_type?: 'movie' | 'tv' | 'person';
  genre_ids?: number[];
  vote_average?: number; 
};

const transformTmdbItemToContentItem = (item: TmdbTrendingListItem, itemMediaTypeKnown?: 'movie' | 'tv'): TmdbContentItem | null => {
  const mediaType = itemMediaTypeKnown || item.media_type;
  if (mediaType !== 'movie' && mediaType !== 'tv') return null; 

  const currentGenresMap = mediaType === 'movie' ? movieGenresMap : tvGenresMap;
  const genreNames = item.genre_ids?.map((id: number) => currentGenresMap.get(id)).filter(Boolean) as string[] || [];

  const durationStr = undefined; 
  const releaseDate = 'release_date' in item ? item.release_date : ('first_air_date' in item ? item.first_air_date : undefined);

  return {
    id: String(item.id),
    title: ('title' in item ? item.title : item.name) || 'Untitled',
    imageUrl: getTmdbImageUrl(item.poster_path, 'w500'),
    backdropUrl: getTmdbImageUrl(item.backdrop_path, 'w780'),
    description: item.overview,
    releaseDate: releaseDate,
    type: mediaType, // TmdbContentItem.type is now required
    voteAverage: item.vote_average,
    matchPercentage: item.vote_average ? Math.round(item.vote_average * 10) : undefined,
    releaseYear: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
    duration: durationStr, 
    genres: genreNames.slice(0,3),
  };
};

/**
 * Handles GET requests to fetch trending movies and TV shows from the TMDB API.
 *
 * Retrieves trending media data based on query parameters for media type, time window, and page. Transforms TMDB results into a normalized format with genre names and metadata, and returns paginated results as JSON.
 *
 * @param request - The incoming HTTP request containing query parameters: `mediaType` ('movie', 'tv', or 'all'), `timeWindow` ('day' or 'week'), and `page`.
 * @returns A JSON response with a list of trending content items and pagination details, or an error message if the request fails.
 *
 * @remark Returns a 500 error if the TMDB API key is not configured or if an unexpected error occurs. Returns TMDB error details if the TMDB API responds with an error.
 */
export async function GET(request: Request) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key is not configured' }, { status: 500 });
  }
  
  if (movieGenresMap.size === 0 || tvGenresMap.size === 0) {
      await fetchGenres();
  }

  const { searchParams } = new URL(request.url);
  const timeWindow = searchParams.get('timeWindow') || 'day';
  const page = searchParams.get('page') || '1';
  let mediaTypeParam = searchParams.get('mediaType') || 'all'; 

  let endpoint;
  if (mediaTypeParam === 'movie' || mediaTypeParam === 'tv') {
    endpoint = `/trending/${mediaTypeParam}/${timeWindow}`;
  } else {
    mediaTypeParam = 'all'; 
    endpoint = `/trending/all/${timeWindow}`;
  }

  try {
    const apiUrl = getTmdbApiUrl(endpoint, { page });
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ status_message: response.statusText })); // Ensure errorData is always an object
      console.error('TMDB API Error (Trending):', errorData);
      return NextResponse.json({ 
        error: `Failed to fetch trending data from TMDB: ${errorData.status_message || response.statusText}`,
        details: errorData
      }, { status: response.status });
    }

    const data: { page: number; results: TmdbTrendingListItem[]; total_pages: number; total_results: number } = await response.json();
    const knownMediaTypeForTransform = (mediaTypeParam !== 'all') ? (mediaTypeParam as 'movie' | 'tv') : undefined;
    
    const transformedResults: TmdbContentItem[] = data.results
        .map((item: TmdbTrendingListItem) => transformTmdbItemToContentItem(item, knownMediaTypeForTransform))
        .filter((item: TmdbContentItem | null): item is TmdbContentItem => item !== null);

    return NextResponse.json({ 
        results: transformedResults,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
    } as TmdbApiListResponse<TmdbContentItem>);

  } catch (error) {
    console.error(`Error in /api/tmdb/trending (mediaType: ${mediaTypeParam}, timeWindow: ${timeWindow}):`, error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ 
      error: 'Failed to fetch trending data due to an unexpected error.',
      details: errorMessage
     }, { status: 500 });
  }
}
