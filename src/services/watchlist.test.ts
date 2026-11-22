import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWatchlist, WatchlistError } from './watchlist';

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('fetchWatchlist', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('requests the watchlist of a user and returns its films', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ films: [{ title: 'Heat', year: 1995 }] }));
		vi.stubGlobal('fetch', fetchMock);

		await expect(fetchWatchlist({ type: 'letterboxd', username: 'dave' })).resolves.toEqual([{ title: 'Heat', year: 1995 }]);
		expect(fetchMock.mock.calls[0][0]).toBe('/api/watchlist?user=dave');
	});

	it('requests a shared JustWatch list by its id', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ films: [] }));
		vi.stubGlobal('fetch', fetchMock);

		await fetchWatchlist({ type: 'justwatch', listId: 'tl-us-bd94f102-aef1-4887-b110-bb2674662683' });

		expect(fetchMock.mock.calls[0][0]).toBe('/api/watchlist?list=tl-us-bd94f102-aef1-4887-b110-bb2674662683');
	});

	it('maps error responses to their kind', async () => {
		const kinds = ['notFound', 'emptyOrPrivate', 'noMovies', 'tooManyRequests'] as const;
		for (const kind of kinds) {
			vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: kind }, 400)));
			await expect(fetchWatchlist({ type: 'letterboxd', username: 'dave' })).rejects.toEqual(new WatchlistError(kind));
		}
	});

	it('treats unknown or unreadable errors as a failure', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: 'weird' }, 500)));
		await expect(fetchWatchlist({ type: 'letterboxd', username: 'dave' })).rejects.toEqual(new WatchlistError('failed'));

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>', { status: 502 })));
		await expect(fetchWatchlist({ type: 'letterboxd', username: 'dave' })).rejects.toEqual(new WatchlistError('failed'));
	});
});
