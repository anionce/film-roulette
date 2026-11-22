import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MovieGenre } from '../constants/genre';
import { StreamingServices } from '../constants/streamingServices';
import { LanguageProvider } from '../i18n/LanguageProvider';
import { EMPTY_FILTERS } from '../lib/filters';
import type { APIMovieResponse, Movie } from '../models/MovieResponse';
import { RecommendationError, fetchRecommendations } from '../services/recommendations';
import { discoverMovies, findMovies, withDetails } from '../services/tmdb';
import { WatchlistError, fetchWatchlist } from '../services/watchlist';
import { MovieEra } from '../constants/era';
import { makeMovie, toAvailability } from '../test/factories';
import { useMovieRoulette } from './useMovieRoulette';

vi.mock('../services/tmdb', () => ({ discoverMovies: vi.fn(), findMovies: vi.fn(), withDetails: vi.fn() }));
vi.mock('../services/watchlist', async importOriginal => ({
	...(await importOriginal<Record<string, unknown>>()),
	fetchWatchlist: vi.fn(),
}));
vi.mock('../services/recommendations', async importOriginal => ({
	...(await importOriginal<Record<string, unknown>>()),
	fetchRecommendations: vi.fn(),
}));

const page = (movies: Movie[], totalPages = 1): APIMovieResponse => ({
	page: 1,
	results: movies,
	total_pages: totalPages,
	total_results: movies.length,
});

const wrapper = ({ children }: { children: ReactNode }) => <LanguageProvider>{children}</LanguageProvider>;

const renderRoulette = () => renderHook(() => useMovieRoulette(), { wrapper }).result;

const comedy = { ...EMPTY_FILTERS, genre: [MovieGenre.Comedy] };

describe('useMovieRoulette', () => {
	beforeEach(() => {
		vi.mocked(discoverMovies).mockReset();
		vi.mocked(withDetails).mockImplementation(async movies =>
			movies.map(movie => ({ ...movie, streaming: { link: '', flatrate: toAvailability([StreamingServices.Netflix]) } }))
		);
	});

	it('loads a random batch of available movies', async () => {
		vi.mocked(discoverMovies).mockResolvedValue(page([makeMovie({ id: 1 }), makeMovie({ id: 2 })]));
		const roulette = renderRoulette();

		await act(() => roulette.current.start('random', EMPTY_FILTERS));

		expect(roulette.current.status).toBe('ready');
		expect(roulette.current.movies.map(m => m.id).sort()).toEqual([1, 2]);
		expect(roulette.current.hasNext).toBe(true);
	});

	it('walks through results and stops when the catalog is exhausted', async () => {
		vi.mocked(discoverMovies).mockResolvedValue(page([makeMovie({ id: 1 }), makeMovie({ id: 2 })]));
		const roulette = renderRoulette();

		await act(() => roulette.current.start('filtered', comedy));
		expect(roulette.current.isCatalogExhausted).toBe(true);
		expect(roulette.current.showFewResults).toBe(true);

		act(() => roulette.current.next());
		expect(roulette.current.index).toBe(1);
		expect(roulette.current.hasNext).toBe(false);

		act(() => roulette.current.previous());
		expect(roulette.current.index).toBe(0);
	});

	it('fetches more pages when reaching the end of a big catalog', async () => {
		vi.mocked(discoverMovies).mockImplementation(async args => page([makeMovie({ id: args.page })], 50));
		const roulette = renderRoulette();

		await act(() => roulette.current.start('filtered', comedy));
		const loaded = roulette.current.movies.length;
		act(() => roulette.current.next());
		while (roulette.current.index < loaded - 1) act(() => roulette.current.next());

		await act(async () => roulette.current.next());

		await waitFor(() => expect(roulette.current.movies.length).toBeGreaterThan(loaded));
		expect(roulette.current.index).toBe(loaded);
	});

	it('explains when a genre combination has no results', async () => {
		vi.mocked(discoverMovies).mockResolvedValue(page([]));
		const roulette = renderRoulette();

		await act(() => roulette.current.start('filtered', { ...EMPTY_FILTERS, genre: [MovieGenre.Comedy, MovieGenre.Horror] }));

		expect(roulette.current.status).toBe('empty');
		expect(roulette.current.emptyReason).toBe('genreCombo');
	});

	it('reports errors and can retry the same search', async () => {
		vi.mocked(discoverMovies)
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValue(page([makeMovie()]));
		const roulette = renderRoulette();

		await act(() => roulette.current.start('filtered', comedy));
		expect(roulette.current.status).toBe('error');

		await act(async () => roulette.current.retry());
		await waitFor(() => expect(roulette.current.status).toBe('ready'));
	});

	it('recommends the movies the AI suggested that are available', async () => {
		const recommendations = [
			{ title: 'Heat', year: 1995 },
			{ title: 'Unknown film', year: 2001 },
		];
		vi.mocked(fetchRecommendations).mockResolvedValue(recommendations);
		vi.mocked(findMovies).mockResolvedValue([makeMovie({ id: 7, release_date: '1995-12-15' })]);
		const roulette = renderRoulette();

		await act(() => roulette.current.recommend('heist movies'));

		expect(fetchRecommendations).toHaveBeenCalledWith('heist movies', expect.any(AbortSignal));
		expect(findMovies).toHaveBeenCalledWith(recommendations, 'es-ES', expect.any(AbortSignal));
		expect(roulette.current.mode).toBe('ai');
		expect(roulette.current.status).toBe('ready');
		expect(roulette.current.movies.map(movie => movie.id)).toEqual([7]);
		expect(roulette.current.hasNext).toBe(false);
	});

	it('is empty when none of the recommendations can be watched in Spain', async () => {
		vi.mocked(fetchRecommendations).mockResolvedValue([{ title: 'Heat', year: 1995 }]);
		vi.mocked(findMovies).mockResolvedValue([makeMovie({ id: 7 })]);
		vi.mocked(withDetails).mockImplementation(async movies => movies.map(movie => ({ ...movie })));
		const roulette = renderRoulette();

		await act(() => roulette.current.recommend('heist movies'));

		expect(roulette.current.status).toBe('empty');
		expect(roulette.current.emptyReason).toBe('aiUnavailable');
	});

	it('tells apart prompts that are not about movies and exhausted quota', async () => {
		vi.mocked(fetchRecommendations).mockRejectedValueOnce(new RecommendationError('notMovies'));
		const roulette = renderRoulette();

		await act(() => roulette.current.recommend('capital of France'));
		expect(roulette.current.status).toBe('empty');
		expect(roulette.current.emptyReason).toBe('notMovies');

		vi.mocked(fetchRecommendations).mockRejectedValueOnce(new RecommendationError('quotaExceeded'));
		await act(() => roulette.current.recommend('anything'));
		expect(roulette.current.status).toBe('error');
		expect(roulette.current.errorReason).toBe('quotaExceeded');
	});

	it('retries an AI recommendation with the same prompt', async () => {
		vi.mocked(fetchRecommendations).mockRejectedValueOnce(new RecommendationError('failed'));
		const roulette = renderRoulette();

		await act(() => roulette.current.recommend('space movies'));
		expect(roulette.current.status).toBe('error');

		vi.mocked(fetchRecommendations).mockResolvedValue([]);
		await act(async () => roulette.current.retry());

		expect(fetchRecommendations).toHaveBeenLastCalledWith('space movies', expect.any(AbortSignal));
	});

	describe('watchlist', () => {
		const films = [{ title: 'Heat', year: 1995 }];
		const horror = (id: number) => makeMovie({ id, genre_ids: [27], release_date: '2024-01-01' });

		beforeEach(() => {
			vi.mocked(fetchWatchlist).mockReset().mockResolvedValue(films);
		});

		it('picks available films from the watchlist that match the filters', async () => {
			vi.mocked(findMovies).mockResolvedValue([horror(1), makeMovie({ id: 2, genre_ids: [35] }), horror(3)]);
			const roulette = renderRoulette();

			await act(() => roulette.current.startWatchlist('dave', { ...EMPTY_FILTERS, genre: [MovieGenre.Horror] }));

			expect(fetchWatchlist).toHaveBeenCalledWith({ type: 'letterboxd', username: 'dave' }, expect.any(AbortSignal));
			expect(findMovies).toHaveBeenCalledWith(films, 'es-ES', expect.any(AbortSignal));
			expect(roulette.current.mode).toBe('watchlist');
			expect(roulette.current.status).toBe('ready');
			expect(roulette.current.movies.map(movie => movie.id).sort()).toEqual([1, 3]);
			expect(roulette.current.isCatalogExhausted).toBe(true);
			expect(roulette.current.hasNext).toBe(roulette.current.movies.length > 1);
		});

		it('applies the era filter before asking for details', async () => {
			vi.mocked(findMovies).mockResolvedValue([
				makeMovie({ id: 1, release_date: '1995-01-01' }),
				makeMovie({ id: 2, release_date: '2024-01-01' }),
			]);
			const roulette = renderRoulette();

			await act(() => roulette.current.startWatchlist('dave', { ...EMPTY_FILTERS, era: MovieEra.Decade90 }));

			expect(roulette.current.movies.map(movie => movie.id)).toEqual([1]);
			expect(withDetails).toHaveBeenCalledWith([expect.objectContaining({ id: 1 })], 'es-ES', expect.any(AbortSignal));
		});

		it('loads more of a big watchlist when reaching the end', async () => {
			const bigList = Array.from({ length: 60 }, (_, index) => makeMovie({ id: index + 1 }));
			vi.mocked(findMovies).mockResolvedValue(bigList);
			const roulette = renderRoulette();

			await act(() => roulette.current.startWatchlist('dave', EMPTY_FILTERS));
			const loaded = roulette.current.movies.length;
			expect(roulette.current.isCatalogExhausted).toBe(false);

			while (roulette.current.index < loaded - 1) act(() => roulette.current.next());
			await act(async () => roulette.current.next());

			await waitFor(() => expect(roulette.current.movies.length).toBeGreaterThan(loaded));
			expect(roulette.current.movies.map(movie => movie.id).length).toBe(
				new Set(roulette.current.movies.map(movie => movie.id)).size
			);
		});

		it('reads a shared JustWatch list from its link', async () => {
			const listId = 'tl-us-bd94f102-aef1-4887-b110-bb2674662683';
			vi.mocked(findMovies).mockResolvedValue([makeMovie({ id: 1 })]);
			const roulette = renderRoulette();

			await act(() => roulette.current.startWatchlist(`https://www.justwatch.com/shared?id=${listId}`, EMPTY_FILTERS));

			expect(fetchWatchlist).toHaveBeenCalledWith({ type: 'justwatch', listId }, expect.any(AbortSignal));
			expect(roulette.current.status).toBe('ready');
		});

		it('is empty when nothing in the list matches', async () => {
			vi.mocked(findMovies).mockResolvedValue([makeMovie({ id: 1, genre_ids: [35] })]);
			const roulette = renderRoulette();

			await act(() => roulette.current.startWatchlist('dave', { ...EMPTY_FILTERS, genre: [MovieGenre.Horror] }));

			expect(roulette.current.status).toBe('empty');
			expect(roulette.current.emptyReason).toBe('watchlistNoMatch');
		});

		it('explains unknown users, private lists and too many requests', async () => {
			const roulette = renderRoulette();

			vi.mocked(fetchWatchlist).mockRejectedValueOnce(new WatchlistError('notFound'));
			await act(() => roulette.current.startWatchlist('nobody', EMPTY_FILTERS));
			expect(roulette.current.emptyReason).toBe('watchlistNotFound');

			vi.mocked(fetchWatchlist).mockRejectedValueOnce(new WatchlistError('emptyOrPrivate'));
			await act(() => roulette.current.startWatchlist('dave', EMPTY_FILTERS));
			expect(roulette.current.emptyReason).toBe('watchlistEmpty');

			vi.mocked(fetchWatchlist).mockRejectedValueOnce(new WatchlistError('noMovies'));
			await act(() => roulette.current.startWatchlist('dave', EMPTY_FILTERS));
			expect(roulette.current.emptyReason).toBe('watchlistNoMovies');

			vi.mocked(fetchWatchlist).mockRejectedValueOnce(new WatchlistError('tooManyRequests'));
			await act(() => roulette.current.startWatchlist('dave', EMPTY_FILTERS));
			expect(roulette.current.status).toBe('error');
			expect(roulette.current.errorReason).toBe('rateLimited');
		});

		it('retries the same watchlist', async () => {
			vi.mocked(fetchWatchlist).mockRejectedValueOnce(new WatchlistError('failed'));
			vi.mocked(findMovies).mockResolvedValue([makeMovie({ id: 1 })]);
			const roulette = renderRoulette();

			await act(() => roulette.current.startWatchlist('dave', EMPTY_FILTERS));
			expect(roulette.current.status).toBe('error');

			await act(async () => roulette.current.retry());
			await waitFor(() => expect(roulette.current.status).toBe('ready'));
			expect(fetchWatchlist).toHaveBeenLastCalledWith({ type: 'letterboxd', username: 'dave' }, expect.any(AbortSignal));
		});
	});

	it('resets back to idle', async () => {
		vi.mocked(discoverMovies).mockResolvedValue(page([makeMovie()]));
		const roulette = renderRoulette();

		await act(() => roulette.current.start('random', EMPTY_FILTERS));
		act(() => roulette.current.reset());

		expect(roulette.current.mode).toBeNull();
		expect(roulette.current.status).toBe('idle');
	});
});
