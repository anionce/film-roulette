export type WatchlistFilm = {
	title: string;
	year: number | null;
	tmdbId?: number;
};

export type WatchlistResponse = {
	films: WatchlistFilm[];
};

export const WATCHLIST_ERROR_KINDS = ['notFound', 'emptyOrPrivate', 'noMovies', 'tooManyRequests', 'failed'] as const;

export type WatchlistErrorKind = (typeof WATCHLIST_ERROR_KINDS)[number];

export type WatchlistSource = { type: 'letterboxd'; username: string } | { type: 'justwatch'; listId: string };

export const LETTERBOXD_USERNAME_PATTERN = /^[A-Za-z0-9_]{2,15}$/;

export const JUSTWATCH_LIST_ID_PATTERN = /^tl-[a-z]{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
