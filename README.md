# Movie Explorer 🎬

A modern web application for discovering, exploring, and saving your favorite movies. Built with Next.js, TypeScript, and the TMDB API.

![Movie Explorer](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)

## 🌐 Live Demo

**[View Live App](https://movie-explorer-demo.vercel.app)** *(Update this link after deployment)*

## ✨ Features

- **🔍 Movie Search**: Search for movies by title with real-time results from TMDB
- **📖 Movie Details**: View comprehensive movie information including poster, overview, runtime, and genres
- **❤️ Favorites System**: Save movies to your personal favorites list
- **⭐ Personal Ratings**: Rate your favorite movies from 1-5 stars
- **📝 Notes**: Add personal notes and comments to each favorite
- **💾 Persistent Storage**: Favorites survive page refresh via LocalStorage
- **🔒 Secure API**: TMDB API key is kept server-side via proxy routes
- **📱 Responsive Design**: Beautiful UI that works on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- TMDB API key ([Get one free here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movie-explorer.git
   cd movie-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your TMDB API key:
   ```
   TMDB_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
movie-explorer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── movies/
│   │   │       ├── search/route.ts    # Search proxy endpoint
│   │   │       └── [id]/route.ts      # Movie details proxy endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Main application page
│   ├── components/
│   │   ├── ErrorMessage.tsx
│   │   ├── FavoritesList.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieDetailsModal.tsx
│   │   ├── MovieGrid.tsx
│   │   ├── SearchBar.tsx
│   │   └── StarRating.tsx
│   ├── hooks/
│   │   ├── useFavorites.ts           # Favorites state & persistence
│   │   ├── useMovieDetails.ts        # Movie details fetching
│   │   └── useMovieSearch.ts         # Search functionality
│   ├── lib/
│   │   └── constants.ts              # Image URLs, storage keys
│   └── types/
│       └── movie.ts                  # TypeScript interfaces
├── public/
│   └── placeholder-poster.svg
├── .env.example
├── .env.local
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

## 🔧 Technical Decisions & Tradeoffs

### API Proxy Pattern
- **Decision**: All TMDB API calls go through Next.js API routes (`/api/movies/*`)
- **Rationale**: Keeps the API key server-side, preventing exposure in browser network requests
- **Tradeoff**: Adds a small latency hop, but security benefits outweigh this cost

### State Management
- **Decision**: React hooks + Context-free architecture
- **Rationale**: The app's state is simple enough that prop drilling + custom hooks are sufficient
- **Tradeoff**: With more complex features (user auth, etc.), a state management library would be beneficial

### Client-Side Persistence (LocalStorage)
- **Decision**: Favorites stored in LocalStorage
- **Rationale**: Simple, no backend required, data survives refresh
- **Tradeoff**: Data is device-specific and has size limits (~5MB)

### Component Architecture
- **Decision**: Presentational components with hooks for logic
- **Rationale**: Separation of concerns, easier testing, reusable components
- **Tradeoff**: More files to manage, but better maintainability

### Tailwind CSS
- **Decision**: Utility-first CSS with Tailwind
- **Rationale**: Rapid development, consistent design system, small bundle size
- **Tradeoff**: HTML can get verbose, but the DX benefits are worth it

### TypeScript
- **Decision**: Full TypeScript with strict mode
- **Rationale**: Type safety, better IDE support, self-documenting code
- **Tradeoff**: Initial setup time, but catches bugs early

## 🎨 Design Decisions

- **Dark Theme**: Cinema-inspired dark UI with amber/orange accents
- **Outfit Font**: Modern, clean typography for excellent readability
- **Card Layout**: Familiar movie poster grid layout users expect
- **Modal for Details**: Keeps users in context, no page navigation needed
- **Responsive Grid**: 2-5 columns depending on screen size

## ⚠️ Known Limitations

1. **No User Authentication**: Favorites are local to the device
2. **No Server-Side Persistence**: Would require a database for cross-device sync
3. **Search Debouncing**: Could add debounce to reduce API calls during typing
4. **No Caching Strategy**: Could implement SWR or React Query for better caching
5. **Limited Error Recovery**: Some edge cases could have better error handling
6. **No Offline Support**: Could add PWA features for offline access

## 🔮 Future Improvements

With more time, I would add:

1. **User Authentication** (NextAuth.js + database)
2. **Server-Side Favorites** (Prisma + PostgreSQL)
3. **Advanced Filtering** (genre, year, rating filters)
4. **Infinite Scroll** (instead of "Load More" button)
5. **Movie Recommendations** (based on favorites)
6. **Watch Later List** (separate from favorites)
7. **Social Features** (share favorites, see friends' lists)
8. **PWA Support** (offline access, installable app)
9. **Unit & E2E Tests** (Jest + Playwright)
10. **Performance Optimizations** (React Query, skeleton loading)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `TMDB_API_KEY` to Environment Variables
4. Deploy!

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📄 License

MIT License - feel free to use this project for learning or as a starting point!

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the excellent movie API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
