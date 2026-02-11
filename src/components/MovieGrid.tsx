'use client';

import { TMDBMovie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: TMDBMovie[];
  isFavorite: (movieId: number) => boolean;
  onViewDetails: (movie: TMDBMovie) => void;
  onToggleFavorite: (movie: TMDBMovie) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function MovieGrid({
  movies,
  isFavorite,
  onViewDetails,
  onToggleFavorite,
  isLoading,
  hasMore,
  onLoadMore,
}: MovieGridProps) {
  if (movies.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFavorite(movie.id)}
            onViewDetails={onViewDetails}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl
                     border border-zinc-700 hover:border-zinc-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Movies'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
