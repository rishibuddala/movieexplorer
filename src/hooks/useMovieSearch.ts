'use client';

import { useState, useCallback } from 'react';
import { TMDBMovie, TMDBSearchResponse } from '@/types/movie';

interface UseMovieSearchReturn {
  movies: TMDBMovie[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchMovies: (query: string, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export function useMovieSearch(): UseMovieSearchReturn {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastQuery, setLastQuery] = useState('');

  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed with status ${response.status}`);
      }

      const data: TMDBSearchResponse = await response.json();

      if (data.results.length === 0 && page === 1) {
        setError('No movies found. Try a different search term.');
        setMovies([]);
      } else {
        setMovies(page === 1 ? data.results : (prev) => [...prev, ...data.results]);
      }

      setTotalResults(data.total_results);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      if (page === 1) {
        setMovies([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (currentPage < totalPages && lastQuery && !isLoading) {
      await searchMovies(lastQuery, currentPage + 1);
    }
  }, [currentPage, totalPages, lastQuery, isLoading, searchMovies]);

  const clearResults = useCallback(() => {
    setMovies([]);
    setError(null);
    setTotalResults(0);
    setCurrentPage(1);
    setTotalPages(0);
    setLastQuery('');
  }, []);

  return {
    movies,
    isLoading,
    error,
    totalResults,
    currentPage,
    totalPages,
    searchMovies,
    loadMore,
    clearResults,
  };
}
