import { useRef, useState } from 'react';
import { mapValueToEraRange } from '../constants/era';
import type { FilterArguments } from '../constants/filters';
import { mapValueToGenre } from '../constants/genre';
import { mapValueToMovieRuntime } from '../constants/runtime';
import { mapValueToStreamingService } from '../constants/streamingServices';
import { useLanguage } from '../i18n/useLanguage';
import { EMPTY_FILTERS } from '../lib/filters';
import {
	filterAvailableMovies,
	filterMovies,
	getRandomPage,
	getSearchStartPage,
	hasVODAvailability,
	nextPageWindow,
	pickSearchResult,
	shuffle,
	uniqueById,
	type PageCursor,
} from '../lib/movies';
import type { CompleteMovie, Movie } from '../models/MovieResponse';
import { fetchRecommendations, RecommendationError } from '../services/recommendations';
import { discoverMovies, searchMovies, withDetails, type DiscoverArgs } from '../services/tmdb';

export type StartMode = 'filtered' | 'random';
export type RouletteMode = StartMode | 'ai';
export type RouletteStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';
export type EmptyReason = 'default' | 'genreCombo' | 'notMovies' | 'aiUnavailable';
export type ErrorReason = 'default' | 'quotaExceeded';

const PAGE_WINDOW_SIZE = 4;
const MIN_RESULTS_TARGET = 100;
const MAX_FETCH_WINDOWS = 6;
export const FEW_RESULTS_THRESHOLD = 30;

type RouletteState = {
	mode: RouletteMode | null;
	status: RouletteStatus;
	movies: CompleteMovie[];
	index: number;
	emptyReason: EmptyReason;
	errorReason: ErrorReason;
	isFetchingMore: boolean;
	isCatalogExhausted: boolean;
};

type Search = {
	mode: RouletteMode;
	filters: FilterArguments;
	prompt: string;
	controller: AbortController;
	totalPages: number;
	cursor: PageCursor;
};

const INITIAL_STATE: RouletteState = {
	mode: null,
	status: 'idle',
	movies: [],
	index: 0,
	emptyReason: 'default',
	errorReason: 'default',
	isFetchingMore: false,
	isCatalogExhausted: false,
};

const filteredQuery = (filters: FilterArguments, language: string, page: number): DiscoverArgs => {
	const eraRange = mapValueToEraRange(filters.era);
	return {
		page,
		language,
		runtime: mapValueToMovieRuntime(filters.duration),
		genres: mapValueToGenre(filters.genre),
		streamingServices: mapValueToStreamingService(filters.streaming),
		releaseDateGte: eraRange?.gte,
		releaseDateLte: eraRange?.lte,
	};
};

const emptyReasonFor = (mode: RouletteMode, filters: FilterArguments): EmptyReason => {
	if (mode === 'ai') return 'aiUnavailable';
	return mode === 'filtered' && (filters.genre?.length ?? 0) > 1 ? 'genreCombo' : 'default';
};

const isRecommendationError = (error: unknown, kind: RecommendationError['kind']) =>
	error instanceof RecommendationError && error.kind === kind;

export const useMovieRoulette = () => {
	const { language } = useLanguage();
	const tmdbLanguage = language === 'en' ? 'en-US' : 'es-ES';
	const [state, setState] = useState<RouletteState>(INITIAL_STATE);
	const searchRef = useRef<Search | null>(null);

	const update = (patch: Partial<RouletteState>) => setState(prev => ({ ...prev, ...patch }));

	const fetchPages = async (search: Search, start: number, end: number): Promise<CompleteMovie[]> => {
		const movies: CompleteMovie[] = [];
		for (let page = start; page <= end; page++) {
			const { results } = await discoverMovies(filteredQuery(search.filters, tmdbLanguage, page), search.controller.signal);
			movies.push(...(await withDetails(results, tmdbLanguage, search.controller.signal)));
		}
		return movies;
	};

	const fetchNextWindow = async (search: Search): Promise<CompleteMovie[]> => {
		const window = nextPageWindow(search.cursor, search.totalPages, PAGE_WINDOW_SIZE);
		const movies = await fetchPages(search, window.start, window.end);
		search.cursor = window.cursor;
		return movies;
	};

	const fetchRandomBatch = async (search: Search): Promise<CompleteMovie[]> => {
		const { results } = await discoverMovies({ page: getRandomPage(), language: tmdbLanguage }, search.controller.signal);
		return shuffle(filterAvailableMovies(await withDetails(results, tmdbLanguage, search.controller.signal)));
	};

	const fetchFirstFilteredResults = async (search: Search): Promise<CompleteMovie[]> => {
		const firstPage = await discoverMovies(filteredQuery(search.filters, tmdbLanguage, 1), search.controller.signal);
		search.totalPages = firstPage.total_pages;
		search.cursor = { next: getSearchStartPage(firstPage.total_pages), remaining: firstPage.total_pages };

		let fetched: CompleteMovie[] = [];
		let results: CompleteMovie[] = [];
		for (
			let windows = 0;
			results.length < MIN_RESULTS_TARGET && windows < MAX_FETCH_WINDOWS && search.cursor.remaining > 0;
			windows++
		) {
			fetched = [...fetched, ...(await fetchNextWindow(search))];
			results = filterMovies(shuffle(fetched), search.filters);
		}
		return results;
	};

	const fetchRecommendedMovies = async (search: Search): Promise<CompleteMovie[]> => {
		const { signal } = search.controller;
		const recommendations = await fetchRecommendations(search.prompt, signal);
		const matches = await Promise.all(
			recommendations.map(async ({ title, year }) =>
				pickSearchResult(await searchMovies(title, tmdbLanguage, signal), year)
			)
		);
		const found = uniqueById(matches.filter((movie): movie is Movie => movie !== undefined));
		return (await withDetails(found, tmdbLanguage, signal)).filter(hasVODAvailability);
	};

	const loadFirstBatch: Record<RouletteMode, (search: Search) => Promise<CompleteMovie[]>> = {
		filtered: fetchFirstFilteredResults,
		random: fetchRandomBatch,
		ai: fetchRecommendedMovies,
	};

	const run = async (search: Search, task: () => Promise<void>) => {
		try {
			await task();
		} catch (error) {
			if (search.controller.signal.aborted) return;
			if (isRecommendationError(error, 'notMovies')) return update({ status: 'empty', emptyReason: 'notMovies' });
			update({
				status: 'error',
				errorReason: isRecommendationError(error, 'quotaExceeded') ? 'quotaExceeded' : 'default',
				isFetchingMore: false,
			});
		}
	};

	const begin = (mode: RouletteMode, filters: FilterArguments, prompt: string) => {
		searchRef.current?.controller.abort();
		const search: Search = {
			mode,
			filters,
			prompt,
			controller: new AbortController(),
			totalPages: 0,
			cursor: { next: 1, remaining: 0 },
		};
		searchRef.current = search;
		setState({ ...INITIAL_STATE, mode, status: 'loading' });

		return run(search, async () => {
			const movies = await loadFirstBatch[mode](search);
			if (search.controller.signal.aborted) return;
			update({
				movies,
				status: movies.length ? 'ready' : 'empty',
				emptyReason: emptyReasonFor(mode, filters),
				isCatalogExhausted: mode === 'ai' || (mode === 'filtered' && search.cursor.remaining <= 0),
			});
		});
	};

	const start = (mode: StartMode, filters: FilterArguments) => begin(mode, filters, '');

	const recommend = (prompt: string) => begin('ai', EMPTY_FILTERS, prompt);

	const loadMore = (search: Search) => {
		update({ isFetchingMore: true });

		return run(search, async () => {
			if (search.mode === 'random') {
				const movies = await fetchRandomBatch(search);
				if (search.controller.signal.aborted) return;
				update(movies.length ? { movies, index: 0, isFetchingMore: false } : { status: 'empty', isFetchingMore: false });
				return;
			}

			const newMovies = shuffle(filterMovies(await fetchNextWindow(search), search.filters));
			if (search.controller.signal.aborted) return;
			setState(prev => ({
				...prev,
				movies: [...prev.movies, ...newMovies],
				index: newMovies.length ? prev.movies.length : 0,
				isFetchingMore: false,
				isCatalogExhausted: search.cursor.remaining <= 0,
			}));
		});
	};

	const next = () => {
		const search = searchRef.current;
		if (!search || state.isFetchingMore) return;
		if (state.index < state.movies.length - 1) return update({ index: state.index + 1 });
		if (search.mode === 'random' || !state.isCatalogExhausted) return loadMore(search);
		update({ index: 0 });
	};

	const previous = () => update({ index: Math.max(state.index - 1, 0) });

	const reset = () => {
		searchRef.current?.controller.abort();
		searchRef.current = null;
		setState(INITIAL_STATE);
	};

	const retry = () => {
		const search = searchRef.current;
		if (search) begin(search.mode, search.filters, search.prompt);
	};

	const isLastMovie = state.index >= state.movies.length - 1;

	return {
		...state,
		currentMovie: state.movies[state.index] as CompleteMovie | undefined,
		hasNext: state.mode === 'random' || !state.isCatalogExhausted || !isLastMovie,
		showFewResults:
			state.mode === 'filtered' &&
			state.isCatalogExhausted &&
			state.movies.length > 0 &&
			state.movies.length < FEW_RESULTS_THRESHOLD,
		start,
		recommend,
		next,
		previous,
		reset,
		retry,
	};
};

export type MovieRoulette = ReturnType<typeof useMovieRoulette>;
