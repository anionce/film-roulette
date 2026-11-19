# Film Roulette

https://filmroulette.netlify.app/

Can't decide what to watch? Pick genres, duration, era and your streaming platforms, and Film Roulette shows you movies one by one — or press **Random** for a surprise. Available in Spanish and English, with availability for Spain.

**Stack:** Vite + React 19 + TypeScript · React Router · MUI · Sass · react-swipeable · TMDB API · Vitest + Testing Library.

## How it works

- Searches use TMDB's discover endpoint, starting from a random page so results are not always the same blockbusters.
- Pages are fetched in windows until there are enough results, and more are loaded as you move forward.
- Each movie is enriched with its details and Spanish watch providers, then filtered client-side: it must be available on a subscription, free or ad-supported service (or rent/buy when no platform is chosen), come from a preferred origin unless it is very popular, and match the selected era.
- Requests retry with backoff on transient errors and are cancelled when you leave the movie page.

## Structure

```
src/
  components/   UI pieces: filter buttons and modals, poster, plot, platforms, states
  constants/    genres, runtimes, eras and platforms with their TMDB ids
  hooks/        useMovieRoulette: search, paging and navigation through results
  i18n/         translations and language provider
  lib/          pure logic: filters, movie filtering, shuffling, page windows
  models/       TMDB response types
  pages/        Home, MoviePage, NotFound
  services/     TMDB client
  test/         test setup, factories and render helper
```

## Getting started

```bash
npm install
echo "VITE_TOKEN=<your TMDB read access token>" > .env
npm run dev
```

The app runs at http://localhost:3000. When deploying (Netlify), set `VITE_TOKEN` in the site's environment settings.

## Scripts

| Script               | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the dev server                |
| `npm test`           | Run the test suite once             |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run typecheck`  | Type-check the project              |
| `npm run lint`       | Lint with ESLint                    |
| `npm run format`     | Format with Prettier                |
| `npm run build`      | Type-check and build to `build/`    |
| `npm run preview`    | Serve the production build locally  |

## Tests

Vitest + Testing Library on jsdom. Unit tests cover filtering, shuffling, paging, era ranges and the TMDB query builder and retries; hook tests cover the roulette flow with the TMDB client mocked; component tests cover choosing filters and browsing movies from the user's point of view. Tests never call TMDB or read `.env`.
