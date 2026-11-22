# Film Roulette

https://filmroulette.netlify.app/

Can't decide what to watch? Pick genres, duration, era and your streaming platforms, and Film Roulette shows you movies one by one — or press **Random** for a surprise. Available in Spanish and English, with availability for Spain.

**Stack:** Vite + React 19 + TypeScript · React Router · MUI · Sass · react-swipeable · TMDB API · Google Gemini API (via a Netlify Function) · Vitest + Testing Library.

## How it works

- Searches use TMDB's discover endpoint, starting from a random page so results are not always the same blockbusters.
- Pages are fetched in windows until there are enough results, and more are loaded as you move forward.
- Each movie is enriched with its details and Spanish watch providers, then filtered client-side: it must be available on a subscription, free or ad-supported service (or rent/buy when no platform is chosen), come from a preferred origin unless it is very popular, and match the selected era.
- Requests retry with backoff on transient errors and are cancelled when you leave the movie page.

## AI recommendations

Below the filters there is a free-text box: describe what you feel like watching ("a heist thriller that is not too long") and the AI suggests films.

- The browser calls `/api/recommend`, a Netlify Function that holds the Gemini API key, so the key never reaches the client.
- The function asks Gemini for a JSON list of film titles and years. Its system instruction restricts it to feature films; anything else is answered with `notMovies` and shown as a friendly message.
- Prompts are capped at 300 characters and each visitor is limited to 10 requests per minute. When the free Gemini quota runs out the app says so instead of failing silently.
- Every suggested title is looked up in TMDB, so invented films are dropped, and only the ones available in Spain are shown, with the usual poster, details and platforms.

## Your own list (Letterboxd or JustWatch)

A second box lets you pick from a list you already keep, with your filters applied (genres, duration, era, platforms). Nothing is uploaded and no account or password is needed:

- **Letterboxd:** type your username. The Netlify Function `/api/watchlist` reads your public watchlist (up to 10 pages) from letterboxd.com.
- **JustWatch:** paste the link you get from _Share List_ on one of your custom lists. The function reads that list from JustWatch's web API. JustWatch has no public profiles, so the main watchlist has to be copied to a custom list first.
- Each film is matched in TMDB (by TMDB id when JustWatch gives it, otherwise by title and year), the genre and era filters run first, and details and providers are fetched in batches as you move forward. Only films available in Spain are shown.
- Both sources are unofficial: they read public pages and JustWatch's internal API, so they can stop working if those change. The function identifies itself, caps the pages it reads, is limited to 3 imports per minute per visitor and lets the CDN cache each list for an hour.

## Structure

```
src/
  components/   UI pieces: filter buttons and modals, poster, plot, platforms, states
  constants/    genres, runtimes, eras and platforms with their TMDB ids
  hooks/        useMovieRoulette: search, paging and navigation through results
  i18n/         translations and language provider
  lib/          pure logic: filters, movie filtering, shuffling, page windows
  models/       TMDB response and recommendation types
  pages/        Home, MoviePage, NotFound
  services/     TMDB and recommendations clients
  test/         test setup, factories and render helper
netlify/
  functions/    recommend and watchlist: serverless endpoints (only function files here)
  lib/          prompt, Gemini client, Letterboxd and JustWatch readers, rate limiter
  tests/        tests for the function
  devServer.ts  serves the function in `npm run dev`
```

## Getting started

```bash
npm install
printf "VITE_TOKEN=<your TMDB read access token>\nGEMINI_API_KEY=<your Google AI Studio API key>\n" > .env
npm run dev
```

The app runs at http://localhost:3000 and `npm run dev` also serves `/api/recommend` locally. When deploying (Netlify), set `VITE_TOKEN` and `GEMINI_API_KEY` in the site's environment settings. `GEMINI_MODEL` is optional and overrides the default model.

## Scripts

| Script               | What it does                       |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the dev server               |
| `npm test`           | Run the test suite once            |
| `npm run test:watch` | Run tests in watch mode            |
| `npm run typecheck`  | Type-check the project             |
| `npm run lint`       | Lint with ESLint                   |
| `npm run format`     | Format with Prettier               |
| `npm run build`      | Type-check and build to `build/`   |
| `npm run preview`    | Serve the production build locally |

## Tests

Vitest + Testing Library on jsdom. Unit tests cover filtering, shuffling, paging, era ranges, the TMDB query builder and retries, and the recommend and watchlist functions (prompt validation, Gemini parsing, Letterboxd and JustWatch parsing, rate limiting) with the outside world mocked; hook tests cover the roulette flow with the TMDB client mocked; component tests cover choosing filters and browsing movies from the user's point of view. Tests never call TMDB, Gemini, Letterboxd or JustWatch or read `.env`.
