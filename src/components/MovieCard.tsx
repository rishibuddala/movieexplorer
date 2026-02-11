'use client';

import Image from 'next/image';
import { TMDBMovie } from '@/types/movie';
import { getImageUrl, POSTER_SIZES } from '@/lib/constants';

interface MovieCardProps {
  movie: TMDBMovie;
  isFavorite: boolean;
  onViewDetails: (movie: TMDBMovie) => void;
  onToggleFavorite: (movie: TMDBMovie) => void;
}

export function MovieCard({
  movie,
  isFavorite,
  onViewDetails,
  onToggleFavorite,
}: MovieCardProps) {
  const year = movie.release_date?.split('-')[0] || 'N/A';
  const posterUrl = getImageUrl(movie.poster_path, POSTER_SIZES.medium);

  return (
    <div
      className="group relative bg-zinc-900/60 rounded-2xl overflow-hidden border border-zinc-800/50
                 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-[1.02]
                 hover:shadow-2xl hover:shadow-amber-500/10"
    >
      {/* Poster */}
      <div
        className="relative aspect-[2/3] cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(movie)}
      >
        {movie.poster_path ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200
                     ${
                       isFavorite
                         ? 'bg-amber-500 text-black'
                         : 'bg-black/50 text-white hover:bg-amber-500 hover:text-black'
                     }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className="w-5 h-5"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-white">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="font-semibold text-white line-clamp-1 cursor-pointer hover:text-amber-400 transition-colors"
          onClick={() => onViewDetails(movie)}
        >
          {movie.title}
        </h3>
        <p className="text-sm text-zinc-400 mt-1">{year}</p>
        {movie.overview && (
          <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{movie.overview}</p>
        )}
      </div>
    </div>
  );
}
