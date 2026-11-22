import { describe, expect, it, vi } from 'vitest';
import { fetchJustWatchList, MAX_JUSTWATCH_PAGES } from './justwatch';
import { WatchlistError } from './watchlistError';

const LIST_ID = 'tl-us-bd94f102-aef1-4887-b110-bb2674662683';

const node = (objectType: string, title: string, year: number | null, tmdbId: string | null) => ({
	node: { objectType, content: { title, originalReleaseYear: year, externalIds: tmdbId ? { tmdbId } : null } },
});

const page = (edges: unknown[], hasNextPage = false) => ({
	data: { genericTitleList: { pageInfo: { endCursor: 'next', hasNextPage }, edges } },
});

const graphql = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('fetchJustWatchList', () => {
	it('returns only the movies of the list with their TMDB ids', async () => {
		const fetcher = vi.fn<typeof fetch>(async () =>
			graphql(
				page([
					node('SHOW', 'Lupin', 2021, '96677'),
					node('MOVIE', 'Heat', 1995, '949'),
					node('MOVIE', 'Obscure', null, null),
				])
			)
		);

		await expect(fetchJustWatchList(LIST_ID, fetcher)).resolves.toEqual([
			{ title: 'Heat', year: 1995, tmdbId: 949 },
			{ title: 'Obscure', year: null },
		]);
	});

	it('queries the list of its country and identifies itself', async () => {
		const fetcher = vi.fn<typeof fetch>(async () => graphql(page([node('MOVIE', 'Heat', 1995, '949')])));

		await fetchJustWatchList(LIST_ID, fetcher);

		const [url, init] = fetcher.mock.calls[0];
		expect(url).toBe('https://apis.justwatch.com/graphql');
		expect(init?.headers).toEqual(expect.objectContaining({ 'User-Agent': expect.stringContaining('FilmRoulette') }));
		expect(JSON.parse(String(init?.body)).variables).toEqual(expect.objectContaining({ listId: LIST_ID, country: 'US' }));
	});

	it('follows the cursor through several pages and stops at the cap', async () => {
		const fetcher = vi.fn<typeof fetch>(async () => graphql(page([node('MOVIE', 'Heat', 1995, '949')], true)));

		const films = await fetchJustWatchList(LIST_ID, fetcher);

		expect(fetcher).toHaveBeenCalledTimes(MAX_JUSTWATCH_PAGES);
		expect(films).toHaveLength(MAX_JUSTWATCH_PAGES);
		expect(JSON.parse(String(fetcher.mock.calls[1][1]?.body)).variables.after).toBe('next');
	});

	it('tells apart missing lists, empty lists, lists with only shows and failures', async () => {
		const run = (response: Response) =>
			fetchJustWatchList(
				LIST_ID,
				vi.fn<typeof fetch>(async () => response)
			);

		await expect(run(graphql({ errors: [{ message: 'no list found' }], data: null }))).rejects.toEqual(
			new WatchlistError('notFound')
		);
		await expect(run(graphql(page([])))).rejects.toEqual(new WatchlistError('emptyOrPrivate'));
		await expect(run(graphql(page([node('SHOW', 'Lupin', 2021, '96677')])))).rejects.toEqual(new WatchlistError('noMovies'));
		await expect(run(graphql({}, 503))).rejects.toEqual(new WatchlistError('failed'));
	});
});
