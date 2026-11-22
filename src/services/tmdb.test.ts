import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeMovie } from '../test/factories';
import { discoverMovies, discoverParams, findMovies, searchMovies, TmdbError, withDetails } from './tmdb';

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('discoverParams', () => {
	it('only sends the filters that are set', () => {
		const params = discoverParams({ page: 2, language: 'es-ES' });
		expect(Object.fromEntries(params)).toEqual({
			language: 'es-ES',
			include_adult: 'false',
			'vote_count.gte': '100',
			'vote_average.gte': '6',
			sort_by: 'popularity.desc',
			page: '2',
		});
	});

	it('excludes animation and documentaries unless they were selected', () => {
		expect(discoverParams({ page: 1, language: 'es-ES', genres: [35] }).get('without_genres')).toBe('16,99');
		expect(discoverParams({ page: 1, language: 'es-ES', genres: [35, 16] }).get('without_genres')).toBe('99');
	});

	it('adds region and providers, relaxing thresholds for Pluto TV alone', () => {
		const params = discoverParams({
			page: 1,
			language: 'es-ES',
			streamingServices: '300',
			runtime: 95,
			releaseDateGte: '1990-01-01',
		});
		expect(params.get('watch_region')).toBe('ES');
		expect(params.get('with_watch_providers')).toBe('300');
		expect(params.get('vote_count.gte')).toBe('20');
		expect(params.get('with_runtime.lte')).toBe('95');
		expect(params.get('primary_release_date.gte')).toBe('1990-01-01');
	});
});

describe('requests', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it('retries transient failures and gives up on 404', async () => {
		vi.useFakeTimers();
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse({}, 429))
			.mockResolvedValueOnce(jsonResponse({ page: 1, results: [], total_pages: 3, total_results: 0 }));
		vi.stubGlobal('fetch', fetchMock);

		const request = discoverMovies({ page: 1, language: 'es-ES' });
		await vi.runAllTimersAsync();
		expect((await request).total_pages).toBe(3);
		expect(fetchMock).toHaveBeenCalledTimes(2);

		fetchMock.mockReset().mockResolvedValue(jsonResponse({}, 404));
		await expect(discoverMovies({ page: 1, language: 'es-ES' })).rejects.toEqual(new TmdbError(404));
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('searches movies by title in the requested language', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ results: [makeMovie({ id: 3 })] }));
		vi.stubGlobal('fetch', fetchMock);

		const results = await searchMovies('Heat', 'es-ES');

		expect(results.map(movie => movie.id)).toEqual([3]);
		const url = new URL(fetchMock.mock.calls[0][0]);
		expect(url.pathname).toBe('/3/search/movie');
		expect(Object.fromEntries(url.searchParams)).toEqual({ query: 'Heat', language: 'es-ES', include_adult: 'false' });
	});

	it('finds the movies matching title and year, dropping unknown and duplicated ones', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async (url: string) => {
				const query = new URL(url).searchParams.get('query');
				if (query === 'Unknown') return jsonResponse({ results: [] });
				return jsonResponse({
					results: [makeMovie({ id: 1, release_date: '2009-01-01' }), makeMovie({ id: 2, release_date: '1995-12-15' })],
				});
			})
		);

		const movies = await findMovies(
			[
				{ title: 'Heat', year: 1995 },
				{ title: 'Heat', year: 1995 },
				{ title: 'Unknown', year: 2000 },
			],
			'es-ES'
		);

		expect(movies.map(movie => movie.id)).toEqual([2]);
	});

	it('uses the TMDB id when the list provides it and falls back to searching when it is gone', async () => {
		const fetchMock = vi.fn(async (url: string) => {
			const { pathname, searchParams } = new URL(url);
			if (pathname === '/3/movie/949')
				return jsonResponse({ ...makeMovie({ id: 949, title: 'Heat' }), genres: [{ id: 28 }, { id: 80 }] });
			if (pathname === '/3/movie/1') return jsonResponse({}, 404);
			if (searchParams.get('query') === 'Gone')
				return jsonResponse({ results: [makeMovie({ id: 77, release_date: '2001-01-01' })] });
			return jsonResponse({ results: [] });
		});
		vi.stubGlobal('fetch', fetchMock);

		const movies = await findMovies(
			[
				{ title: 'Heat', year: 1995, tmdbId: 949 },
				{ title: 'Gone', year: 2001, tmdbId: 1 },
			],
			'es-ES'
		);

		expect(movies.map(movie => movie.id)).toEqual([949, 77]);
		expect(movies[0].genre_ids).toEqual([28, 80]);
	});

	it('searches big lists in batches', async () => {
		const fetchMock = vi.fn(async () => jsonResponse({ results: [] }));
		vi.stubGlobal('fetch', fetchMock);

		await findMovies(
			Array.from({ length: 45 }, (_, index) => ({ title: `Film ${index}`, year: null })),
			'es-ES'
		);

		expect(fetchMock).toHaveBeenCalledTimes(45);
	});

	it('adds details and Spanish providers, tolerating failures', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async (url: string) => {
				if (url.includes('/watch/providers'))
					return jsonResponse({ id: 1, results: { ES: { link: 'jw', flatrate: [] } } });
				return jsonResponse({}, 404);
			})
		);

		const [movie] = await withDetails([makeMovie({ id: 1 })], 'es-ES');
		expect(movie.detail).toBeUndefined();
		expect(movie.streaming).toEqual({ link: 'jw', flatrate: [] });
	});
});
