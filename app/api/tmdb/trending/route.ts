import { NextResponse } from 'next/server';
import { TmdbContentItem, TmdbApiListResponse } from '@/types/tmdb'; // Import shared type

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) {
    return null; 
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const transformTmdbItemToContentItem = (item: any): TmdbContentItem => ({
  id: String(item.id),
  title: item.title || item.name || 'Untitled',
  imageUrl: getImageUrl(item.poster_path, 'w500'),
  backdropUrl: getImageUrl(item.backdrop_path, 'w780'),
  description: item.overview,
  releaseDate: item.release_date || item.first_air_date,
  type: item.media_type as ('movie' | 'tv'),
  voteAverage: item.vote_average,
});

export async function GET(request: Request) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key is not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const timeWindow = searchParams.get('timeWindow') || 'day';
  const page = searchParams.get('page') || '1';
  const mediaType = searchParams.get('mediaType') || 'all';

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('TMDB API Error (Trending):', errorData);
      return NextResponse.json({ error: `Failed to fetch trending data: ${errorData.status_message || response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const transformedResults: TmdbContentItem[] = data.results.map(transformTmdbItemToContentItem).filter((item: TmdbContentItem | null) => item !== null);

    return NextResponse.json({ 
        results: transformedResults,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
    } as TmdbApiListResponse<TmdbContentItem>);

  } catch (error) {
    console.error('Error fetching trending data:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
