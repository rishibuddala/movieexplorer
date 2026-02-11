import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';

  // Validate query parameter
  if (!query || query.trim() === '') {
    return NextResponse.json(
      { error: 'Search query is required' },
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
    const tmdbUrl = new URL(`${TMDB_BASE_URL}/search/movie`);
    tmdbUrl.searchParams.set('api_key', TMDB_API_KEY);
    tmdbUrl.searchParams.set('query', query);
    tmdbUrl.searchParams.set('page', page);
    tmdbUrl.searchParams.set('include_adult', 'false');
    tmdbUrl.searchParams.set('language', 'en-US');

    const response = await fetch(tmdbUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', response.status, errorText);
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API configuration' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to search movies. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Network error. Please check your connection and try again.' },
      { status: 500 }
    );
  }
}
