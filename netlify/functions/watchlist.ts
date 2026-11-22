import {
	JUSTWATCH_LIST_ID_PATTERN,
	LETTERBOXD_USERNAME_PATTERN,
	type WatchlistErrorKind,
	type WatchlistFilm,
} from '../../src/models/Watchlist';
import { fetchJustWatchList } from '../lib/justwatch';
import { fetchWatchlist as fetchLetterboxdWatchlist } from '../lib/letterboxd';
import { createRateLimiter } from '../lib/rateLimiter';
import { WatchlistError } from '../lib/watchlistError';

const REQUESTS_PER_MINUTE = 3;
const ONE_MINUTE_MS = 60_000;
const isRateLimited = createRateLimiter(REQUESTS_PER_MINUTE, ONE_MINUTE_MS);

const ONE_HOUR_SECONDS = 3600;
const ONE_DAY_SECONDS = 86_400;
const CDN_CACHE = `public, s-maxage=${ONE_HOUR_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`;

const STATUS_BY_ERROR: Record<WatchlistErrorKind, number> = {
	notFound: 404,
	emptyOrPrivate: 422,
	noMovies: 422,
	tooManyRequests: 429,
	failed: 500,
};

const fail = (kind: WatchlistErrorKind) => Response.json({ error: kind }, { status: STATUS_BY_ERROR[kind] });

const filmsLoader = (params: URLSearchParams): (() => Promise<WatchlistFilm[]>) | null => {
	const username = params.get('user') ?? '';
	const listId = params.get('list') ?? '';
	if (LETTERBOXD_USERNAME_PATTERN.test(username)) return () => fetchLetterboxdWatchlist(username);
	if (JUSTWATCH_LIST_ID_PATTERN.test(listId)) return () => fetchJustWatchList(listId);
	return null;
};

export default async (request: Request, context: { ip: string }): Promise<Response> => {
	const loadFilms = request.method === 'GET' ? filmsLoader(new URL(request.url).searchParams) : null;
	if (!loadFilms) return fail('failed');
	if (isRateLimited(context.ip)) return fail('tooManyRequests');

	try {
		return Response.json({ films: await loadFilms() }, { headers: { 'Netlify-CDN-Cache-Control': CDN_CACHE } });
	} catch (error) {
		return fail(error instanceof WatchlistError ? error.kind : 'failed');
	}
};
