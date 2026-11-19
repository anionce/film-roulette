import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MovieGenre } from '../constants/genre';
import { StreamingServices } from '../constants/streamingServices';
import { LanguageProvider } from '../i18n/LanguageProvider';
import { EMPTY_FILTERS } from '../lib/filters';
import type { APIMovieResponse, Movie } from '../models/MovieResponse';
import { discoverMovies, withDetails } from '../services/tmdb';
import { makeMovie, toAvailability } from '../test/factories';
import { useMovieRoulette } from './useMovieRoulette';

vi.mock('../services/tmdb', () => ({ discoverMovies: vi.fn(), withDetails: vi.fn() }));

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

	it('resets back to idle', async () => {
		vi.mocked(discoverMovies).mockResolvedValue(page([makeMovie()]));
		const roulette = renderRoulette();

		await act(() => roulette.current.start('random', EMPTY_FILTERS));
		act(() => roulette.current.reset());

		expect(roulette.current.mode).toBeNull();
		expect(roulette.current.status).toBe('idle');
	});
});
