import { JUSTWATCH_LIST_ID_PATTERN, LETTERBOXD_USERNAME_PATTERN, type WatchlistSource } from '../models/Watchlist';

const JUSTWATCH_LIST_ID_IN_TEXT = /tl-[a-z]{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const LETTERBOXD_USERNAME_IN_URL = /^(?:https?:\/\/)?(?:www\.)?letterboxd\.com\/([^/?#\s]+)/i;

export const parseWatchlistSource = (input: string): WatchlistSource | null => {
	const text = input.trim();
	const listId = JUSTWATCH_LIST_ID_IN_TEXT.exec(text)?.[0];
	if (listId && JUSTWATCH_LIST_ID_PATTERN.test(listId)) return { type: 'justwatch', listId };
	const username = LETTERBOXD_USERNAME_IN_URL.exec(text)?.[1] ?? text;
	return LETTERBOXD_USERNAME_PATTERN.test(username) ? { type: 'letterboxd', username } : null;
};
