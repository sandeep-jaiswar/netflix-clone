// types/tmdb.ts
// This file contains transformed and application-specific data structures.
// Raw TMDB API response types are defined in types/tmdb-api.ts

export interface TmdbContentItem {
  id: string;
  title: string;
  imageUrl: string | null;
  backdropUrl?: string | null; // This is for card backgrounds / smaller backdrops
  description?: string;
  releaseDate?: string;
  releaseYear?: string;
  type: 'movie' | 'tv'; // Required for routing and API calls
  voteAverage?: number;
  matchPercentage?: number;
  duration?: string; // e.g., "2h 30m" or "45m"
  genres?: string[]; // Transformed list of genre names for display
  maturityRating?: string; 
}

// Represents detailed content for modal views or detail pages within the application
export interface TmdbDetailedContent extends Omit<TmdbContentItem, 'type' | 'genres' | 'backdropUrl'> {
  type: 'MOVIE' | 'SHOW'; // Application-specific representation (uppercase)
  heroImageUrl?: string | null; // Primary backdrop for detail views
  durationMinutes?: number; // Raw duration in minutes
  ageRating?: string | null; // e.g., "PG-13", "TV-MA"
  previewVideoUrl?: string | null; // e.g., YouTube link
  genres?: { id: string; name: string }[]; // Genres with IDs and names for detailed display/filtering
  castMembers?: {
    id: string;
    name: string;
    characterName?: string;
    imageUrl?: string | null;
  }[];
  seasonsCount?: number; // For TV shows
  isInMyList?: boolean; // UI state: is this item in the user's list?
}

// Generic structure for API list responses (e.g., for categories, search results)
export interface TmdbApiListResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}
