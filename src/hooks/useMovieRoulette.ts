import { useRef, useState } from 'react';
import { mapValueToEraRange } from '../constants/era';
import type { FilterArguments } from '../constants/filters';
import { mapValueToGenre } from '../constants/genre';
import { mapValueToMovieRuntime } from '../constants/runtime';
import { mapValueToStreamingService } from '../constants/streamingServices';
import { useLanguage } from '../i18n/useLanguage';
import {
	filterAvailableMovies,
	filterMovies,
	getRandomPage,
	getSearchStartPage,
	nextPageWindow,
	shuffle,
	type PageCursor,
} from '../lib/movies';
import type { CompleteMovie } from '../models/MovieResponse';
import { discoverMovies, withDetails, type DiscoverArgs } from '../services/tmdb';

export type RouletteMode = 'filtered' | 'random';
export type RouletteStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';
export type EmptyReason = 'default' | 'genreCombo';

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
	isFetchingMore: boolean;
	isCatalogExhausted: boolean;
};

type Search = {
	mode: RouletteMode;
	filters: FilterArguments;
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

	const run = async (search: Search, task: () => Promise<void>) => {
		try {
			await task();
		} catch {
			if (!search.controller.signal.aborted) update({ status: 'error', isFetchingMore: false });
		}
	};

	const start = (mode: RouletteMode, filters: FilterArguments) => {
		searchRef.current?.controller.abort();
		const search: Search = {
			mode,
			filters,
			controller: new AbortController(),
			totalPages: 0,
			cursor: { next: 1, remaining: 0 },
		};
		searchRef.current = search;
		setState({ ...INITIAL_STATE, mode, status: 'loading' });

		return run(search, async () => {
			const movies = mode === 'random' ? await fetchRandomBatch(search) : await fetchFirstFilteredResults(search);
			if (search.controller.signal.aborted) return;
			update({
				movies,
				status: movies.length ? 'ready' : 'empty',
				emptyReason: mode === 'filtered' && (filters.genre?.length ?? 0) > 1 ? 'genreCombo' : 'default',
				isCatalogExhausted: mode === 'filtered' && search.cursor.remaining <= 0,
			});
		});
	};

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
		if (search) start(search.mode, search.filters);
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
		next,
		previous,
		reset,
		retry,
	};
};

export type MovieRoulette = ReturnType<typeof useMovieRoulette>;
