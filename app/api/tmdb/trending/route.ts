// app/api/tmdb/trending/route.ts
import { NextResponse } from 'next/server';
import { TmdbContentItem, TmdbApiListResponse } from '@/types/tmdb';
import type { TmdbGenre, TmdbDetailedResponse as TmdbListItem } from '@/types/tmdb-api';
import { getTmdbImageUrl, getTmdbApiUrl, TMDB_API_KEY, TMDB_BASE_URL } from '@/utils/tmdb-api-helpers';

const movieGenresMap = new Map<number, string>();
const tvGenresMap = new Map<number, string>();

// Note: TMDB_API_KEY and TMDB_BASE_URL are imported but also used directly here for fetchGenres.
// This is acceptable as fetchGenres is a local helper for this specific route's caching need.
async function fetchGenres() {
  if (!TMDB_API_KEY) return; 
  if (movieGenresMap.size === 0) {
    try {
      // Using TMDB_BASE_URL directly here as getTmdbApiUrl is for client-like calls with API key in params
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

// Changed from interface to type to correctly extend/intersect with TmdbListItem (a union type)
type TmdbTrendingListItem = TmdbListItem & {
  media_type?: 'movie' | 'tv' | 'person';
  genre_ids?: number[];
  vote_average?: number; // Ensure vote_average is part of the type
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
    type: mediaType,
    voteAverage: item.vote_average,
    matchPercentage: item.vote_average ? Math.round(item.vote_average * 10) : undefined,
    releaseYear: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
    duration: durationStr, 
    genres: genreNames.slice(0,3),
  };
};

export async function GET(request: Request) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key is not configured' }, { status: 500 });
  }
  
  // Fetch genres if maps are empty (simple in-memory cache)
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
      const errorData = await response.json();
      return NextResponse.json({ error: `TMDB Error: ${errorData.status_message || response.statusText}` }, { status: response.status });
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
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
