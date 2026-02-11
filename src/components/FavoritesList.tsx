'use client';

import Image from 'next/image';
import { FavoriteMovie, TMDBMovie } from '@/types/movie';
import { getImageUrl, POSTER_SIZES } from '@/lib/constants';
import { StarRating } from './StarRating';

interface FavoritesListProps {
  favorites: FavoriteMovie[];
  onViewDetails: (movie: TMDBMovie) => void;
  onRemoveFavorite: (movieId: number) => void;
}

export function FavoritesList({
  favorites,
  onViewDetails,
  onRemoveFavorite,
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-zinc-300 mb-2">No favorites yet</h3>
        <p className="text-zinc-500 max-w-md mx-auto">
          Search for movies and click the heart icon to add them to your favorites list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => {
        const posterUrl = getImageUrl(favorite.poster_path, POSTER_SIZES.small);
        const year = favorite.release_date?.split('-')[0] || 'N/A';
        // Convert FavoriteMovie to TMDBMovie shape for the modal
        const movieForModal: TMDBMovie = {
          id: favorite.id,
          title: favorite.title,
          overview: favorite.overview,
          poster_path: favorite.poster_path,
          backdrop_path: null,
          release_date: favorite.release_date,
          vote_average: 0,
          vote_count: 0,
          genre_ids: [],
          popularity: 0,
          adult: false,
          original_language: 'en',
          original_title: favorite.title,
          video: false,
        };

        return (
          <div
            key={favorite.id}
            className="flex gap-4 p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/50
                     hover:border-amber-500/30 transition-all duration-300"
          >
            {/* Poster */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => onViewDetails(movieForModal)}
            >
              <div className="relative w-20 h-30 rounded-lg overflow-hidden">
                {favorite.poster_path ? (
                  <Image
                    src={posterUrl}
                    alt={favorite.title}
                    width={80}
                    height={120}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-20 h-30 bg-zinc-800 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-zinc-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-white cursor-pointer hover:text-amber-400 transition-colors line-clamp-1"
                onClick={() => onViewDetails(movieForModal)}
              >
                {favorite.title}
              </h3>
              <p className="text-sm text-zinc-400 mt-0.5">{year}</p>

              {favorite.rating > 0 && (
                <div className="mt-2">
                  <StarRating value={favorite.rating} onChange={() => {}} size="sm" readOnly />
                </div>
              )}

              {favorite.note && (
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2 italic">
                  &ldquo;{favorite.note}&rdquo;
                </p>
              )}
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemoveFavorite(favorite.id)}
              className="flex-shrink-0 p-2 text-zinc-500 hover:text-red-400 transition-colors"
              aria-label="Remove from favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
