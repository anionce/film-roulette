import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeMovie } from '../test/factories';
import { discoverMovies, discoverParams, searchMovies, TmdbError, withDetails } from './tmdb';

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
