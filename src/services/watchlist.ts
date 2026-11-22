import {
	WATCHLIST_ERROR_KINDS,
	type WatchlistErrorKind,
	type WatchlistFilm,
	type WatchlistResponse,
	type WatchlistSource,
} from '../models/Watchlist';
import { readErrorKind } from './apiErrors';

const WATCHLIST_ENDPOINT = '/api/watchlist';

export class WatchlistError extends Error {
	readonly kind: WatchlistErrorKind;

	constructor(kind: WatchlistErrorKind) {
		super(`Watchlist request failed: ${kind}`);
		this.kind = kind;
	}
}

const queryFor = (source: WatchlistSource): URLSearchParams =>
	new URLSearchParams(source.type === 'letterboxd' ? { user: source.username } : { list: source.listId });

export const fetchWatchlist = async (source: WatchlistSource, signal?: AbortSignal): Promise<WatchlistFilm[]> => {
	const response = await fetch(`${WATCHLIST_ENDPOINT}?${queryFor(source)}`, { signal });
	if (!response.ok) throw new WatchlistError(await readErrorKind(response, WATCHLIST_ERROR_KINDS, 'failed'));
	return ((await response.json()) as WatchlistResponse).films;
};
