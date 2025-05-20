import { NextRequest, NextResponse } from 'next/server';
import type { TmdbDetailedResponse, TmdbVideo, TmdbReleaseDateResult, TmdbContentRatingResult, TmdbGenre, TmdbCastMember } from '@/types/tmdb-api';
import { getTmdbImageUrl, getTmdbApiUrl, TMDB_API_KEY } from '@/utils/tmdb-api-helpers';

interface DetailedContentData {
  id: string;
  title: string;
  description: string;
  type: 'MOVIE' | 'SHOW';
  releaseDate?: string;
  durationMinutes?: number;
  ageRating?: string;
  thumbnailUrl?: string | null; // Note: This was aligned to imageUrl in TmdbDetailedContent if that's the primary one
  heroImageUrl?: string | null;
  previewVideoUrl?: string | null;
  genres?: { id: string; name: string }[];
  castMembers?: {id: string; name: string; characterName?: string; imageUrl?: string | null }[];
  seasonsCount?: number;
}

const transformDetailedData = (data: TmdbDetailedResponse, mediaType: 'movie' | 'tv', videos: TmdbVideo[]): Omit<DetailedContentData, 'genres' | 'castMembers' | 'seasonsCount' | 'ageRating' | 'thumbnailUrl'> => {
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube');
  let durationMinutes;
  if (mediaType === 'movie' && 'runtime' in data && data.runtime) {
    durationMinutes = data.runtime;
  } else if (mediaType === 'tv' && 'episode_run_time' in data && data.episode_run_time && data.episode_run_time.length > 0) {
    durationMinutes = data.episode_run_time[0];
  }
  return {
    id: String(data.id),
    title: ('title' in data ? data.title : data.name) || 'Untitled',
    description: data.overview || '',
    type: mediaType.toUpperCase() as 'MOVIE' | 'SHOW',
    releaseDate: ('release_date' in data ? data.release_date : data.first_air_date),
    durationMinutes: durationMinutes,
    // thumbnailUrl: getTmdbImageUrl(data.poster_path, 'w500'), // Use imageUrl in TmdbDetailedContent
    heroImageUrl: getTmdbImageUrl(data.backdrop_path, 'original'),
    previewVideoUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaType: string; id: string }> } 
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key is not configured' }, { status: 500 });
  }
  const { mediaType, id } = await params;
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
  }

  try {
    const apiUrl = getTmdbApiUrl(`/${mediaType}/${id}`, { append_to_response: 'videos,credits,external_ids,content_ratings,release_dates' });
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text().catch(() => `(Failed to get error text, status: ${response.status})`); 
      console.error('TMDB API Error (Details):', response.status, errorText);
      return NextResponse.json({ error: `Failed to fetch details from TMDB (status: ${response.status})`, details: errorText}, { status: response.status });
    }

    const data: TmdbDetailedResponse = await response.json();
    
    let ageRating: string | null = null;
    if (mediaType === 'movie' && 'release_dates' in data && data.release_dates) {
        const usRelease = data.release_dates.results.find((r: TmdbReleaseDateResult) => r.iso_3166_1 === 'US');
        if (usRelease && usRelease.release_dates.length > 0) {
            const cert = usRelease.release_dates.find((rd) => rd.certification && (rd.type === 3 || rd.type === 4 || rd.type === 1));
            if (cert) ageRating = cert.certification;
            else if (usRelease.release_dates[0].certification) ageRating = usRelease.release_dates[0].certification;
        }
    } else if (mediaType === 'tv' && 'content_ratings' in data && data.content_ratings) {
        const usRating = data.content_ratings.results.find((r: TmdbContentRatingResult) => r.iso_3166_1 === 'US');
        if (usRating) ageRating = usRating.rating;
    }

    const transformedCoreData = transformDetailedData(data, mediaType as 'movie' | 'tv', data.videos?.results || []);
    const genres = data.genres?.map((g: TmdbGenre) => ({ id: String(g.id), name: g.name })) || [];
    const castMembers = data.credits?.cast?.slice(0, 10).map((c: TmdbCastMember) => ({
        id: String(c.id),
        name: c.name,
        characterName: c.character,
        imageUrl: getTmdbImageUrl(c.profile_path, 'w185'),
    })) || [];
    const seasonsCount = mediaType === 'tv' && 'number_of_seasons' in data ? data.number_of_seasons : undefined;

    // Construct the final object ensuring all fields of DetailedContentData are considered
    const responseData: DetailedContentData = {
      ...transformedCoreData,
      // thumbnailUrl is not part of transformedCoreData if it was omitted, ensure it's handled or remove from DetailedContentData
      thumbnailUrl: getTmdbImageUrl(data.poster_path, 'w500'), // Assuming this should be poster_path
      ageRating: ageRating || undefined,
      genres,
      castMembers,
      seasonsCount,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error(`Error in GET ${mediaType}/${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal server error processing request', details: errorMessage }, { status: 500 });
  }
}
