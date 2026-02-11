'use client';

import { useState, useEffect, useCallback } from 'react';
import { FavoriteMovie, TMDBMovie } from '@/types/movie';
import { FAVORITES_STORAGE_KEY } from '@/lib/constants';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((movie: TMDBMovie, rating: number = 0, note: string = '') => {
    setFavorites((prev) => {
      // Check if already exists
      if (prev.some((f) => f.id === movie.id)) {
        return prev;
      }
      const newFavorite: FavoriteMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        overview: movie.overview,
        rating,
        note,
        addedAt: new Date().toISOString(),
      };
      return [...prev, newFavorite];
    });
  }, []);

  const removeFavorite = useCallback((movieId: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== movieId));
  }, []);

  const updateFavorite = useCallback((movieId: number, updates: Partial<Pick<FavoriteMovie, 'rating' | 'note'>>) => {
    setFavorites((prev) =>
      prev.map((f) => (f.id === movieId ? { ...f, ...updates } : f))
    );
  }, []);

  const isFavorite = useCallback((movieId: number) => {
    return favorites.some((f) => f.id === movieId);
  }, [favorites]);

  const getFavorite = useCallback((movieId: number) => {
    return favorites.find((f) => f.id === movieId);
  }, [favorites]);

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    updateFavorite,
    isFavorite,
    getFavorite,
  };
}
