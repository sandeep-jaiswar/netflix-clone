// app/api/tmdb/trending/route.ts
import { NextResponse } from 'next/server';
import { TmdbContentItem, TmdbApiListResponse } from '@/types/tmdb';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

let movieGenresMap = new Map<number, string>();
let tvGenresMap = new Map<number, string>();

async function fetchGenres() {
  if (!TMDB_API_KEY) return; // Don't fetch if no key
  if (movieGenresMap.size === 0) {
    try {
      const res = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        data.genres.forEach((genre: any) => movieGenresMap.set(genre.id, genre.name));
      }
    } catch (e) { console.error("Failed to fetch movie genres", e); }
  }
  if (tvGenresMap.size === 0) {
     try {
      const res = await fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        data.genres.forEach((genre: any) => tvGenresMap.set(genre.id, genre.name));
      }
    } catch (e) { console.error("Failed to fetch TV genres", e); }
  }
}

const transformTmdbItemToContentItem = (item: any, itemMediaTypeKnown?: 'movie' | 'tv'): TmdbContentItem | null => {
  const mediaType = itemMediaTypeKnown || item.media_type as ('movie' | 'tv');
  if (mediaType !== 'movie' && mediaType !== 'tv') return null; // Filter out persons or unknown

  const currentGenresMap = mediaType === 'movie' ? movieGenresMap : tvGenresMap;
  const genreNames = item.genre_ids?.map((id: number) => currentGenresMap.get(id)).filter(Boolean) as string[] || [];

  let durationStr = undefined;
  // Runtime is usually not available in list/trending endpoints from TMDB
  // if (mediaType === 'movie' && item.runtime) { 
  //     const hours = Math.floor(item.runtime / 60);
  //     const minutes = item.runtime % 60;
  //     if (hours > 0) durationStr = `${hours}h ${minutes}m`;
  //     else durationStr = `${minutes}m`;
  // }

  const releaseDate = item.release_date || item.first_air_date;

  return {
    id: String(item.id),
    title: item.title || item.name || 'Untitled',
    imageUrl: getImageUrl(item.poster_path, 'w500'),
    backdropUrl: getImageUrl(item.backdrop_path, 'w780'),
    description: item.overview,
    releaseDate: releaseDate,
    type: mediaType,
    voteAverage: item.vote_average,
    matchPercentage: item.vote_average ? Math.round(item.vote_average * 10) : undefined,
    releaseYear: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
    duration: durationStr, 
    genres: genreNames.slice(0,3),
    // maturityRating would typically come from a details call, not a list call.
  };
};

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

  let finalApiUrl;
  if (mediaTypeParam === 'movie' || mediaTypeParam === 'tv') {
    finalApiUrl = `${TMDB_BASE_URL}/trending/${mediaTypeParam}/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`;
  } else {
    mediaTypeParam = 'all'; // Default to all if not movie or tv
    finalApiUrl = `${TMDB_BASE_URL}/trending/all/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`;
  }

  try {
    const response = await fetch(finalApiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: `TMDB Error: ${errorData.status_message || response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const knownMediaTypeForTransform = (mediaTypeParam !== 'all') ? (mediaTypeParam as 'movie' | 'tv') : undefined;
    
    const transformedResults: TmdbContentItem[] = data.results
        .map((item: any) => transformTmdbItemToContentItem(item, knownMediaTypeForTransform))
        .filter((item: TmdbContentItem | null): item is TmdbContentItem => item !== null);

    return NextResponse.json({ 
        results: transformedResults,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
    } as TmdbApiListResponse<TmdbContentItem>);

  } catch (error) {
    console.error(`Error in /api/tmdb/trending (mediaType: ${mediaTypeParam}, timeWindow: ${timeWindow}):`, error);
    return NextResponse.json({ error: 'Internal Server Error fetching trending data' }, { status: 500 });
  }
}
