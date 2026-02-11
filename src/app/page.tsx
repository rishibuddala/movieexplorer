'use client';

import { useState, useCallback } from 'react';
import { TMDBMovie } from '@/types/movie';
import { useMovieSearch } from '@/hooks/useMovieSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchBar } from '@/components/SearchBar';
import { MovieGrid } from '@/components/MovieGrid';
import { MovieDetailsModal } from '@/components/MovieDetailsModal';
import { FavoritesList } from '@/components/FavoritesList';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type Tab = 'search' | 'favorites';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    movies,
    isLoading,
    error,
    totalResults,
    currentPage,
    totalPages,
    searchMovies,
    loadMore,
  } = useMovieSearch();

  const {
    favorites,
    isLoaded: favoritesLoaded,
    addFavorite,
    removeFavorite,
    updateFavorite,
    isFavorite,
    getFavorite,
  } = useFavorites();

  const handleSearch = useCallback(
    (query: string) => {
      searchMovies(query);
    },
    [searchMovies]
  );

  const handleViewDetails = useCallback((movie: TMDBMovie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }, []);

  const handleToggleFavorite = useCallback(
    (movie: TMDBMovie) => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const handleAddFavorite = useCallback(
    (movie: TMDBMovie, rating: number, note: string) => {
      addFavorite(movie, rating, note);
    },
    [addFavorite]
  );

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative px-4 pt-12 pb-8 md:pt-20 md:pb-12">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo/Title */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Movie Explorer
              </h1>
            </div>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              Discover your next favorite film. Search, explore, and save movies to your personal collection.
            </p>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 -mb-px
                       ${
                         activeTab === 'search'
                           ? 'text-amber-400 border-amber-400'
                           : 'text-zinc-400 border-transparent hover:text-white'
                       }`}
          >
            Search Results
            {movies.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-zinc-800 rounded-full">
                {totalResults.toLocaleString()}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 -mb-px
                       ${
                         activeTab === 'favorites'
                           ? 'text-amber-400 border-amber-400'
                           : 'text-zinc-400 border-transparent hover:text-white'
                       }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favorites
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-zinc-800 rounded-full">
                  {favorites.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' ? (
          <div>
            {/* Error state */}
            {error && <ErrorMessage message={error} onRetry={() => handleSearch('')} />}

            {/* Loading state - initial */}
            {isLoading && movies.length === 0 && (
              <LoadingSpinner message="Searching for movies..." />
            )}

            {/* Results */}
            {movies.length > 0 && (
              <MovieGrid
                movies={movies}
                isFavorite={isFavorite}
                onViewDetails={handleViewDetails}
                onToggleFavorite={handleToggleFavorite}
                isLoading={isLoading}
                hasMore={currentPage < totalPages}
                onLoadMore={loadMore}
              />
            )}

            {/* Empty state - no search yet */}
            {!isLoading && !error && movies.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                  Start your movie search
                </h3>
                <p className="text-zinc-500 max-w-md mx-auto">
                  Enter a movie title above to discover films. You can add them to your
                  favorites and leave personal ratings and notes.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {!favoritesLoaded ? (
              <LoadingSpinner message="Loading favorites..." />
            ) : (
              <FavoritesList
                favorites={favorites}
                onViewDetails={handleViewDetails}
                onRemoveFavorite={removeFavorite}
              />
            )}
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedMovie ? isFavorite(selectedMovie.id) : false}
        favoriteData={selectedMovie ? getFavorite(selectedMovie.id) : undefined}
        onAddFavorite={handleAddFavorite}
        onRemoveFavorite={removeFavorite}
        onUpdateFavorite={updateFavorite}
      />
    </main>
  );
}
