import type { FilterArguments } from '../constants/filters';
import { RecommendationError } from '../services/recommendations';
import { WatchlistError } from '../services/watchlist';

export type RouletteMode = 'filtered' | 'random' | 'ai' | 'watchlist';
export type EmptyReason =
	| 'default'
	| 'genreCombo'
	| 'notMovies'
	| 'aiUnavailable'
	| 'watchlistNoMatch'
	| 'watchlistNotFound'
	| 'watchlistEmpty'
	| 'watchlistNoMovies';
export type ErrorReason = 'default' | 'quotaExceeded' | 'rateLimited';

export const emptyReasonForMode = (mode: RouletteMode, filters: FilterArguments): EmptyReason => {
	if (mode === 'ai') return 'aiUnavailable';
	if (mode === 'watchlist') return 'watchlistNoMatch';
	return mode === 'filtered' && (filters.genre?.length ?? 0) > 1 ? 'genreCombo' : 'default';
};

export const emptyReasonForError = (error: unknown): EmptyReason | null => {
	if (error instanceof RecommendationError && error.kind === 'notMovies') return 'notMovies';
	if (error instanceof WatchlistError && error.kind === 'notFound') return 'watchlistNotFound';
	if (error instanceof WatchlistError && error.kind === 'emptyOrPrivate') return 'watchlistEmpty';
	if (error instanceof WatchlistError && error.kind === 'noMovies') return 'watchlistNoMovies';
	return null;
};

export const errorReasonForError = (error: unknown): ErrorReason => {
	if (error instanceof RecommendationError && error.kind === 'quotaExceeded') return 'quotaExceeded';
	if (error instanceof WatchlistError && error.kind === 'tooManyRequests') return 'rateLimited';
	return 'default';
};
