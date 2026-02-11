'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { TMDBMovie, TMDBMovieDetails, FavoriteMovie } from '@/types/movie';
import { getImageUrl, POSTER_SIZES, BACKDROP_SIZES } from '@/lib/constants';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { StarRating } from './StarRating';

interface MovieDetailsModalProps {
  movie: TMDBMovie | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  favoriteData: FavoriteMovie | undefined;
  onAddFavorite: (movie: TMDBMovie, rating: number, note: string) => void;
  onRemoveFavorite: (movieId: number) => void;
  onUpdateFavorite: (movieId: number, updates: { rating?: number; note?: string }) => void;
}

export function MovieDetailsModal({
  movie,
  isOpen,
  onClose,
  isFavorite,
  favoriteData,
  onAddFavorite,
  onRemoveFavorite,
  onUpdateFavorite,
}: MovieDetailsModalProps) {
  const { movie: details, isLoading, error, fetchMovieDetails, clearMovie } = useMovieDetails();
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');

  // Fetch movie details when modal opens
  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails(movie.id);
      // Initialize rating/note from favorite data if exists
      if (favoriteData) {
        setRating(favoriteData.rating);
        setNote(favoriteData.note);
      } else {
        setRating(0);
        setNote('');
      }
    } else {
      clearMovie();
    }
  }, [isOpen, movie, favoriteData, fetchMovieDetails, clearMovie]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleAddFavorite = useCallback(() => {
    if (movie) {
      onAddFavorite(movie, rating, note);
    }
  }, [movie, rating, note, onAddFavorite]);

  const handleUpdateFavorite = useCallback(() => {
    if (movie) {
      onUpdateFavorite(movie.id, { rating, note });
    }
  }, [movie, rating, note, onUpdateFavorite]);

  if (!isOpen || !movie) return null;

  const displayData = details || movie;
  const posterUrl = getImageUrl(displayData.poster_path, POSTER_SIZES.large);
  const backdropUrl = displayData.backdrop_path
    ? getImageUrl(displayData.backdrop_path, BACKDROP_SIZES.large)
    : null;
  const year = displayData.release_date?.split('-')[0] || 'N/A';
  
  // Type-safe extraction for details-only fields
  const movieDetails = details as TMDBMovieDetails | null;
  const runtimeMinutes = movieDetails?.runtime ?? null;
  const runtime = runtimeMinutes !== null
    ? `${Math.floor(runtimeMinutes / 60)}h ${runtimeMinutes % 60}m`
    : null;
  const genres = movieDetails?.genres
    ? movieDetails.genres.map((g) => g.name).join(', ')
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Backdrop image */}
          {backdropUrl && (
            <div className="relative h-64 md:h-80">
              <Image
                src={backdropUrl}
                alt={displayData.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
            </div>
          )}

          <div className={`p-6 md:p-8 ${backdropUrl ? '-mt-20 relative z-10' : ''}`}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-48 h-72 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">
                  {displayData.poster_path ? (
                    <Image
                      src={posterUrl}
                      alt={displayData.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                      <svg
                        className="w-16 h-16 text-zinc-600"
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

              {/* Details */}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {displayData.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-zinc-400 mb-4">
                  <span>{year}</span>
                  {runtime && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span>{runtime}</span>
                    </>
                  )}
                  {displayData.vote_average > 0 && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {displayData.vote_average.toFixed(1)}
                      </span>
                    </>
                  )}
                </div>

                {genres && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {genres.split(', ').map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
                    <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  </div>
                ) : error ? (
                  <p className="text-red-400">{error}</p>
                ) : (
                  <p className="text-zinc-300 leading-relaxed">{displayData.overview || 'No overview available.'}</p>
                )}

                {/* Favorite Section */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {isFavorite ? 'Your Rating & Notes' : 'Add to Favorites'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Your Rating</label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Personal Note (optional)</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add your thoughts about this movie..."
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white 
                                 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                 focus:border-amber-500/50 resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      {isFavorite ? (
                        <>
                          <button
                            onClick={handleUpdateFavorite}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 
                                     text-black font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400
                                     transition-all duration-200"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => onRemoveFavorite(movie.id)}
                            className="px-6 py-3 bg-zinc-800 text-red-400 font-semibold rounded-xl
                                     hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50
                                     transition-all duration-200"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleAddFavorite}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 
                                   text-black font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400
                                   transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Add to Favorites
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
