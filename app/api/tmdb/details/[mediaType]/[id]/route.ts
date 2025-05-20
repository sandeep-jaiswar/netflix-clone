import { NextResponse } from 'next/server';
import {
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBVideo,
  TMDBGenre,
  TMDBCast,
} from '@/types/tmdb';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getImageUrl = (path: string | null, size: string = 'original') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
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
  castMembers?: {
    id: string;
    name: string;
    characterName?: string;
    imageUrl?: string | null;
  }[];
  seasonsCount?: number;
}

const transformDetailedData = (
  data: TMDBMovieDetails | TMDBTVDetails,
  mediaType: 'movie' | 'tv',
  videos: TMDBVideo[]
): Omit<DetailedContentData, 'genres' | 'castMembers' | 'seasonsCount' | 'ageRating'> => {
  const trailer = videos.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || videos.find((v) => v.site === 'YouTube');

  let durationMinutes: number | undefined;
  if (mediaType === 'movie' && 'runtime' in data) {
    durationMinutes = data.runtime;
  } else if (mediaType === 'tv' && 'episode_run_time' in data && data.episode_run_time.length > 0) {
    durationMinutes = data.episode_run_time[0];
  }

  return {
    id: String(data.id),
    title: 'title' in data ? data.title : data.name,
    description: data.overview || '',
    type: mediaType.toUpperCase() as 'MOVIE' | 'SHOW',
    releaseDate:
      mediaType === 'movie'
        ? (data as TMDBMovieDetails).release_date
        : (data as TMDBTVDetails).first_air_date,
    durationMinutes,
    thumbnailUrl: getImageUrl(data.poster_path, 'w500'),
    heroImageUrl: getImageUrl(data.backdrop_path, 'original'),
    previewVideoUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
  };
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mediaType: string; id: string }> }
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: 'TMDB API key is not configured' },
      { status: 500 }
    );
  }

  const { mediaType, id } = await params;

  if (mediaType !== 'movie' && mediaType !== 'tv') {
    return NextResponse.json(
      { error: 'Invalid media type. Must be "movie" or "tv".' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,external_ids,content_ratings,release_dates`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('TMDB API Error (Details):', errorData);
      return NextResponse.json(
        {
          error:
            `Failed to fetch details: ${errorData.status_message || response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: TMDBMovieDetails | TMDBTVDetails = await response.json();

    let ageRating: string | null = null;
    if (mediaType === 'movie') {
      const movieData = data as TMDBMovieDetails;
      const usRelease = movieData.release_dates?.results.find((r) => r.iso_3166_1 === 'US');
      if (usRelease) {
        const cert = usRelease.release_dates.find(
          (rd) => rd.certification && [1, 3, 4].includes(rd.type)
        );
        ageRating = cert?.certification || usRelease.release_dates[0]?.certification || null;
      }
    } else if (mediaType === 'tv') {
      const tvData = data as TMDBTVDetails;
      const usRating = tvData.content_ratings?.results.find((r) => r.iso_3166_1 === 'US');
      ageRating = usRating?.rating || null;
    }

    const transformedCoreData = transformDetailedData(
      data,
      mediaType,
      data.videos?.results || []
    );

    const genres = (data.genres || []).map((g: TMDBGenre) => ({
      id: String(g.id),
      name: g.name,
    }));

    const castMembers =
      data.credits?.cast?.slice(0, 10).map((c: TMDBCast) => ({
        id: String(c.id),
        name: c.name,
        characterName: c.character,
        imageUrl: getImageUrl(c.profile_path, 'w185'),
      })) || [];

    const seasonsCount =
      mediaType === 'tv' ? (data as TMDBTVDetails).number_of_seasons : undefined;

    return NextResponse.json({
      ...transformedCoreData,
      ageRating: ageRating || undefined,
      genres,
      castMembers,
      seasonsCount,
    } as DetailedContentData);
  } catch (error) {
    console.error(`Error fetching ${mediaType} details for ID ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server'},
      { status: 500 }
    );
  }
}
