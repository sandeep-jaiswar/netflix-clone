import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getImageUrl = (path: string | null, size: string = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

interface DetailedContentData {
  id: string;
  title: string;
  description: string;
  type: 'MOVIE' | 'SHOW';
  releaseDate?: string;
  durationMinutes?: number;
  ageRating?: string;
  thumbnailUrl?: string | null;
  heroImageUrl?: string | null;
  previewVideoUrl?: string | null;
  genres?: { id: string; name: string }[];
  castMembers?: {id: string; name: string; characterName?: string; imageUrl?: string | null }[];
  seasonsCount?: number;
}

const transformDetailedData = (data: any, mediaType: 'movie' | 'tv', videos: any[]): Omit<DetailedContentData, 'genres' | 'castMembers' | 'seasonsCount' | 'ageRating'> => {
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube');
  
  let durationMinutes;
  if (mediaType === 'movie' && data.runtime) {
    durationMinutes = data.runtime;
  } else if (mediaType === 'tv' && data.episode_run_time && data.episode_run_time.length > 0) {
    durationMinutes = data.episode_run_time[0];
  }

  return {
    id: String(data.id),
    title: data.title || data.name || 'Untitled',
    description: data.overview || '',
    type: mediaType.toUpperCase() as 'MOVIE' | 'SHOW',
    releaseDate: data.release_date || data.first_air_date,
    durationMinutes: durationMinutes,
    thumbnailUrl: getImageUrl(data.poster_path, 'w500'),
    heroImageUrl: getImageUrl(data.backdrop_path, 'original'),
    previewVideoUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
  };
};


export async function GET(
  request: Request,
  { params }: { params: { mediaType: string; id: string } }
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key is not configured' }, { status: 500 });
  }

  const { mediaType, id } = params;

  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return NextResponse.json({ error: 'Invalid media type. Must be "movie" or "tv".' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,external_ids,content_ratings,release_dates`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('TMDB API Error (Details):', errorData);
      return NextResponse.json({ error: `Failed to fetch details: ${errorData.status_message || response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    
    let ageRating = null;
    if (mediaType === 'movie' && data.release_dates) {
        const usRelease = data.release_dates.results.find((r: any) => r.iso_3166_1 === 'US');
        if (usRelease && usRelease.release_dates.length > 0) {
            const cert = usRelease.release_dates.find((rd: any) => rd.certification && (rd.type === 3 || rd.type === 4 || rd.type === 1));
            if (cert) ageRating = cert.certification;
            else if (usRelease.release_dates[0].certification) ageRating = usRelease.release_dates[0].certification;
        }
    } else if (mediaType === 'tv' && data.content_ratings) {
        const usRating = data.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US');
        if (usRating) ageRating = usRating.rating;
    }

    const transformedCoreData = transformDetailedData(data, mediaType as 'movie' | 'tv', data.videos?.results || []);
    
    const genres = data.genres?.map((g: any) => ({ id: String(g.id), name: g.name })) || [];
    
    const castMembers = data.credits?.cast?.slice(0, 10).map((c: any) => ({
        id: String(c.id),
        name: c.name,
        characterName: c.character,
        imageUrl: getImageUrl(c.profile_path, 'w185'),
    })) || [];
    
    const seasonsCount = mediaType === 'tv' ? data.number_of_seasons : undefined;

    return NextResponse.json({
      ...transformedCoreData,
      ageRating: ageRating || undefined,
      genres,
      castMembers,
      seasonsCount,
    } as DetailedContentData);

  } catch (error) {
    console.error(`Error fetching ${mediaType} details for ID ${id}:`, error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
