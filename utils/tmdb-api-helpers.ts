const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const getTmdbImageUrl = (path: string | null, size: string = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getTmdbApiUrl = (endpoint: string, params?: Record<string, string>) => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured');
  }
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
};

export { TMDB_API_KEY, TMDB_BASE_URL };
