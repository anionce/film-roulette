import { describe, expect, it, vi } from 'vitest';
import { fetchWatchlist, MAX_WATCHLIST_PAGES, parseTotalPages, parseWatchlistPage } from './letterboxd';
import { WatchlistError } from './watchlistError';

const watchlistHtml = (names: string[], lastPage = 1) => `
	<ul>${names.map(name => `<li class="griditem"><div class="react-component" data-item-name="${name}" data-item-slug="x"></div></li>`).join('')}</ul>
	${Array.from({ length: lastPage }, (_, index) => `<a href="/dave/watchlist/page/${index + 1}/">${index + 1}</a>`).join('')}
`;

const htmlResponse = (html: string, status = 200) => new Response(html, { status });

describe('parseWatchlistPage', () => {
	it('reads titles and years', () => {
		expect(parseWatchlistPage(watchlistHtml(['Everytime (2026)', 'La Gradiva']))).toEqual([
			{ title: 'Everytime', year: 2026 },
			{ title: 'La Gradiva', year: null },
		]);
	});

	it('decodes HTML entities and keeps years inside titles', () => {
		expect(
			parseWatchlistPage(watchlistHtml(['Tom &amp; Jerry (2021)', 'Ocean&#039;s Eleven (2001)', 'Caf&#233; (1999)']))
		).toEqual([
			{ title: 'Tom & Jerry', year: 2021 },
			{ title: "Ocean's Eleven", year: 2001 },
			{ title: 'Café', year: 1999 },
		]);
	});

	it('returns nothing when the page has no films', () => {
		expect(parseWatchlistPage('<html></html>')).toEqual([]);
	});
});

describe('parseTotalPages', () => {
	it('uses the highest page link', () => {
		expect(parseTotalPages(watchlistHtml(['A (2000)'], 22))).toBe(22);
	});

	it('is one page when there is no pagination', () => {
		expect(parseTotalPages(watchlistHtml(['A (2000)']))).toBe(1);
		expect(parseTotalPages('<html></html>')).toBe(1);
	});
});

describe('fetchWatchlist', () => {
	it('reads every page of a short watchlist', async () => {
		const fetcher = vi.fn<typeof fetch>(async url =>
			htmlResponse(String(url).endsWith('/page/2/') ? watchlistHtml(['B (2001)'], 2) : watchlistHtml(['A (2000)'], 2))
		);

		const films = await fetchWatchlist('dave', fetcher);

		expect(films).toEqual([
			{ title: 'A', year: 2000 },
			{ title: 'B', year: 2001 },
		]);
		expect(fetcher.mock.calls.map(call => call[0])).toEqual([
			'https://letterboxd.com/dave/watchlist/',
			'https://letterboxd.com/dave/watchlist/page/2/',
		]);
	});

	it('identifies itself and caps how many pages it reads', async () => {
		const fetcher = vi.fn<typeof fetch>(async () => htmlResponse(watchlistHtml(['A (2000)'], 50)));

		await fetchWatchlist('dave', fetcher);

		expect(fetcher).toHaveBeenCalledTimes(MAX_WATCHLIST_PAGES);
		expect(fetcher.mock.calls[0][1]).toEqual({ headers: { 'User-Agent': expect.stringContaining('FilmRoulette') } });
	});

	it('tells apart unknown users, empty or private lists and failures', async () => {
		const run = (response: Response) => fetchWatchlist('dave', async () => response);

		await expect(run(htmlResponse('', 404))).rejects.toEqual(new WatchlistError('notFound'));
		await expect(run(htmlResponse('<html></html>'))).rejects.toEqual(new WatchlistError('emptyOrPrivate'));
		await expect(run(htmlResponse('', 503))).rejects.toEqual(new WatchlistError('failed'));
	});
});
