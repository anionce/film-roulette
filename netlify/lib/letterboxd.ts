import type { WatchlistFilm } from '../../src/models/Watchlist';
import { WatchlistError } from './watchlistError';

const LETTERBOXD_URL = 'https://letterboxd.com';
const USER_AGENT = 'FilmRoulette/1.0 (+https://filmroulette.netlify.app)';
export const MAX_WATCHLIST_PAGES = 10;

const FILM_NAME_ATTRIBUTE = /data-item-name="([^"]*)"/g;
const NAME_WITH_YEAR = /^(.*) \((\d{4})\)$/;
const WATCHLIST_PAGE_LINK = /\/watchlist\/page\/(\d+)\//g;
const HTML_ENTITIES: Record<string, string> = {
	'&amp;': '&',
	'&quot;': '"',
	'&#039;': "'",
	'&#39;': "'",
	'&lt;': '<',
	'&gt;': '>',
};

const decodeHtml = (text: string): string =>
	text
		.replace(/&(amp|quot|#0?39|lt|gt);/g, entity => HTML_ENTITIES[entity] ?? entity)
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const toFilm = (name: string): WatchlistFilm => {
	const decoded = decodeHtml(name).trim();
	const match = NAME_WITH_YEAR.exec(decoded);
	return match ? { title: match[1], year: Number(match[2]) } : { title: decoded, year: null };
};

export const parseWatchlistPage = (html: string): WatchlistFilm[] =>
	[...html.matchAll(FILM_NAME_ATTRIBUTE)].map(match => toFilm(match[1])).filter(film => film.title.length > 0);

export const parseTotalPages = (html: string): number =>
	Math.max(1, ...[...html.matchAll(WATCHLIST_PAGE_LINK)].map(match => Number(match[1])));

const fetchPage = async (username: string, page: number, fetcher: typeof fetch): Promise<string> => {
	const path = page > 1 ? `page/${page}/` : '';
	const response = await fetcher(`${LETTERBOXD_URL}/${username}/watchlist/${path}`, { headers: { 'User-Agent': USER_AGENT } });
	if (response.status === 404) throw new WatchlistError('notFound');
	if (!response.ok) throw new WatchlistError('failed');
	return response.text();
};

export const fetchWatchlist = async (username: string, fetcher: typeof fetch = fetch): Promise<WatchlistFilm[]> => {
	const firstPage = await fetchPage(username, 1, fetcher);
	const lastPage = Math.min(parseTotalPages(firstPage), MAX_WATCHLIST_PAGES);
	const otherPages = await Promise.all(
		Array.from({ length: lastPage - 1 }, (_, index) => fetchPage(username, index + 2, fetcher))
	);
	const films = [firstPage, ...otherPages].flatMap(parseWatchlistPage);
	if (!films.length) throw new WatchlistError('emptyOrPrivate');
	return films;
};
