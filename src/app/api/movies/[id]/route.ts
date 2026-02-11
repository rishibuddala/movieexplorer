import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Validate movie ID
  const movieId = parseInt(id, 10);
  if (isNaN(movieId) || movieId <= 0) {
    return NextResponse.json(
      { error: 'Invalid movie ID' },
      { status: 400 }
    );
  }

  // Validate API key is configured
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Movie service is not configured. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    const tmdbUrl = new URL(`${TMDB_BASE_URL}/movie/${movieId}`);
    tmdbUrl.searchParams.set('api_key', TMDB_API_KEY);
    tmdbUrl.searchParams.set('language', 'en-US');

    const response = await fetch(tmdbUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', response.status, errorText);
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        );
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API configuration' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch movie details. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Movie details API error:', error);
    return NextResponse.json(
      { error: 'Network error. Please check your connection and try again.' },
      { status: 500 }
    );
  }
}
