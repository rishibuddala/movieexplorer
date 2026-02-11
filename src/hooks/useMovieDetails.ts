'use client';

import { useState, useCallback } from 'react';
import { TMDBMovieDetails } from '@/types/movie';

interface UseMovieDetailsReturn {
  movie: TMDBMovieDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  clearMovie: () => void;
}

export function useMovieDetails(): UseMovieDetailsReturn {
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieDetails = useCallback(async (movieId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/movies/${movieId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch movie details`);
      }

      const data: TMDBMovieDetails = await response.json();
      setMovie(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMovie = useCallback(() => {
    setMovie(null);
    setError(null);
  }, []);

  return {
    movie,
    isLoading,
    error,
    fetchMovieDetails,
    clearMovie,
  };
}
