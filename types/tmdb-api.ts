export interface TmdbVideo {
  type: string;
  site: string;
  key: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbReleaseDate {
  certification: string;
  type: number;
}

export interface TmdbReleaseDateResult {
  iso_3166_1: string;
  release_dates: TmdbReleaseDate[];
}

export interface TmdbContentRatingResult {
  iso_3166_1: string;
  rating: string;
}

interface TmdbResponseBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  videos?: { results: TmdbVideo[] };
  credits?: { cast: TmdbCastMember[] };
  genres?: TmdbGenre[];
}

export interface TmdbMovieResponse extends TmdbResponseBase {
  title: string;
  release_date: string;
  runtime: number | null;
  release_dates?: { results: TmdbReleaseDateResult[] };
}

export interface TmdbTvResponse extends TmdbResponseBase {
  name: string;
  first_air_date: string;
  episode_run_time?: number[];
  number_of_seasons?: number;
  content_ratings?: { results: TmdbContentRatingResult[] };
}

export type TmdbDetailedResponse = TmdbMovieResponse | TmdbTvResponse;
