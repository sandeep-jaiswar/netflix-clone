// types/tmdb.ts

export interface TmdbContentItem {
  id: string;
  title: string;
  imageUrl: string | null;
  backdropUrl?: string | null;
  description?: string;
  releaseDate?: string;
  releaseYear?: string;
  type?: 'movie' | 'tv';
  voteAverage?: number;
  matchPercentage?: number;
  duration?: string;
  genres?: string[];
  maturityRating?: string; 
}

export interface TmdbDetailedContent extends Omit<TmdbContentItem, 'type' | 'genres'> {
  type: 'MOVIE' | 'SHOW';
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
  // isInMyList: boolean; 
}

export interface TmdbApiListResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}
