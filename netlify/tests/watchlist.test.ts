import { afterEach, describe, expect, it, vi } from 'vitest';
import watchlist from '../functions/watchlist';

const page = (names: string[]) => names.map(name => `<div data-item-name="${name}"></div>`).join('');

let nextIp = 0;

const get = (query: string, ip = `10.1.0.${nextIp++}`) =>
	watchlist(new Request(`https://film.test/api/watchlist${query}`), { ip });

describe('watchlist function', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('returns the films of a public watchlist and lets the CDN cache it', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(page(['Heat (1995)'])))
		);

		const response = await get('?user=dave');

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ films: [{ title: 'Heat', year: 1995 }] });
		expect(response.headers.get('Netlify-CDN-Cache-Control')).toContain('s-maxage');
	});

	it('rejects invalid usernames without calling Letterboxd', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);

		expect((await get('')).status).toBe(500);
		expect((await get('?user=../etc/passwd')).status).toBe(500);
		expect((await get('?user=a')).status).toBe(500);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reports unknown users and empty or private lists', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('', { status: 404 }))
		);
		const unknown = await get('?user=nobody');
		expect(unknown.status).toBe(404);
		expect(await unknown.json()).toEqual({ error: 'notFound' });

		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('<html></html>'))
		);
		const empty = await get('?user=privateuser');
		expect(empty.status).toBe(422);
		expect(await empty.json()).toEqual({ error: 'emptyOrPrivate' });
	});

	it('fails cleanly when Letterboxd breaks', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('', { status: 503 }))
		);

		expect((await get('?user=dave')).status).toBe(500);
	});

	it('returns the movies of a shared JustWatch list', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				Response.json({
					data: {
						genericTitleList: {
							pageInfo: { endCursor: null, hasNextPage: false },
							edges: [
								{
									node: {
										objectType: 'MOVIE',
										content: { title: 'Heat', originalReleaseYear: 1995, externalIds: { tmdbId: '949' } },
									},
								},
							],
						},
					},
				})
			)
		);

		const response = await get('?list=tl-us-bd94f102-aef1-4887-b110-bb2674662683');

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ films: [{ title: 'Heat', year: 1995, tmdbId: 949 }] });
	});

	it('reports lists that only have shows', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				Response.json({
					data: {
						genericTitleList: {
							pageInfo: { endCursor: null, hasNextPage: false },
							edges: [
								{
									node: {
										objectType: 'SHOW',
										content: { title: 'Lupin', originalReleaseYear: 2021, externalIds: null },
									},
								},
							],
						},
					},
				})
			)
		);

		const response = await get('?list=tl-us-bd94f102-aef1-4887-b110-bb2674662683');

		expect(response.status).toBe(422);
		expect(await response.json()).toEqual({ error: 'noMovies' });
	});

	it('rejects malformed list ids without calling JustWatch', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);

		expect((await get('?list=tl-us-nope')).status).toBe(500);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('does not contact the source when the visitor is over the limit', async () => {
		const fetchMock = vi.fn(async () => new Response('<div data-item-name="Heat (1995)"></div>'));
		vi.stubGlobal('fetch', fetchMock);

		for (let attempt = 0; attempt < 4; attempt++) await get('?user=dave', '7.7.7.7');

		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it('limits how often one visitor can import', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(page(['Heat (1995)'])))
		);

		const statuses = [];
		for (let attempt = 0; attempt < 4; attempt++) statuses.push((await get('?user=dave', '9.8.7.6')).status);

		expect(statuses).toEqual([200, 200, 200, 429]);
	});
});
