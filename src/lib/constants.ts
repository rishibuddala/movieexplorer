export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
} as const;

export const BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original',
} as const;

export const FAVORITES_STORAGE_KEY = 'movie-explorer-favorites';

export const getImageUrl = (
  path: string | null,
  size: string = POSTER_SIZES.medium
): string => {
  if (!path) {
    return '/placeholder-poster.svg';
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
