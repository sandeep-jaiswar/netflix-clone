// --- types/tmdb.ts ---

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBVideo {
  key: string;
  type: string;
  site: string;
}

export interface TMDBReleaseDate {
  certification: string;
  type: number;
}

export interface TMDBReleaseDatesResult {
  iso_3166_1: string;
  release_dates: TMDBReleaseDate[];
}

export interface TMDBContentRating {
  iso_3166_1: string;
  rating: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: TMDBGenre[];
  videos: { results: TMDBVideo[] };
  credits: { cast: TMDBCast[] };
  release_dates: { results: TMDBReleaseDatesResult[] };
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  episode_run_time: number[];
  number_of_seasons: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: TMDBGenre[];
  videos: { results: TMDBVideo[] };
  credits: { cast: TMDBCast[] };
  content_ratings: { results: TMDBContentRating[] };
}

export type TMDBMediaType = 'movie' | 'tv';
export type TMDBDetailedResponse = TMDBMovieDetails | TMDBTVDetails;

// types/tmdb.ts

export interface TmdbContentItem {
  id: string;
  title: string;
  imageUrl: string | null;
  backdropUrl?: string | null; // This is for card backgrounds / smaller backdrops
  description?: string;
  releaseDate?: string;
  releaseYear?: string;
  type: 'movie' | 'tv'; // Changed to be required
  voteAverage?: number;
  matchPercentage?: number;
  duration?: string;
  genres?: string[];
  maturityRating?: string; 
}

export interface TmdbDetailedContent extends Omit<TmdbContentItem, 'type' | 'genres' | 'backdropUrl'> {
  type: 'MOVIE' | 'SHOW'; // This remains specific for detailed content (MOVIE/SHOW vs movie/tv)
  heroImageUrl?: string | null; // For hero sections in detailed views
  durationMinutes?: number;
  ageRating?: string | null;
  previewVideoUrl?: string | null;
  genres?: { id: string; name: string }[];
  castMembers?: {
    id: string;
    name: string;
    characterName?: string;
    imageUrl?: string | null;
  }[];
  seasonsCount?: number;
  isInMyList?: boolean;
}

export interface TmdbApiListResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}
