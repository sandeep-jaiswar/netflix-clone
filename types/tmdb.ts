// Basic content item for cards and rows
export interface TmdbContentItem {
  id: string; 
  title: string;
  imageUrl: string | null; 
  description?: string;
  releaseDate?: string; 
  type?: 'movie' | 'tv'; 
  backdropUrl?: string | null;
  voteAverage?: number; 
}

// Detailed content for the modal
export interface TmdbDetailedContent extends TmdbContentItem {
  id: string;
  title: string;
  description: string;
  type: 'MOVIE' | 'SHOW';
  releaseDate?: string; 
  durationMinutes?: number;
  ageRating?: string | null; 
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
  seasonsCount?: number; // For TV shows
  // isInMyList: boolean; 
}

// API response for a list of items (e.g., trending, discover)
export interface TmdbApiListResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}
