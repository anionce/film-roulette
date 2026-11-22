import { describe, expect, it } from 'vitest';
import { parseWatchlistSource } from './watchlistSource';

const LIST_ID = 'tl-us-bd94f102-aef1-4887-b110-bb2674662683';

describe('parseWatchlistSource', () => {
	it('understands Letterboxd usernames', () => {
		expect(parseWatchlistSource('  dave ')).toEqual({ type: 'letterboxd', username: 'dave' });
	});

	it('understands Letterboxd profile and watchlist links', () => {
		const expected = { type: 'letterboxd', username: 'dave' };

		expect(parseWatchlistSource('https://letterboxd.com/dave/watchlist/')).toEqual(expected);
		expect(parseWatchlistSource('letterboxd.com/dave')).toEqual(expected);
		expect(parseWatchlistSource('https://www.letterboxd.com/dave/?x=1')).toEqual(expected);
	});

	it('understands the link JustWatch gives when sharing a list', () => {
		expect(parseWatchlistSource(`https://www.justwatch.com/shared?id=${LIST_ID}`)).toEqual({
			type: 'justwatch',
			listId: LIST_ID,
		});
	});

	it('understands the address the shared link redirects to and a bare list id', () => {
		const redirected = `https://www.justwatch.com/us/lists/public-lists?content_type=MOVIE&list_id=${LIST_ID}`;

		expect(parseWatchlistSource(redirected)).toEqual({ type: 'justwatch', listId: LIST_ID });
		expect(parseWatchlistSource(LIST_ID)).toEqual({ type: 'justwatch', listId: LIST_ID });
	});

	it('rejects anything that is neither a username nor a list link', () => {
		expect(parseWatchlistSource('')).toBeNull();
		expect(parseWatchlistSource('a')).toBeNull();
		expect(parseWatchlistSource('bad name!')).toBeNull();
		expect(parseWatchlistSource('https://example.com/lists/123')).toBeNull();
		expect(parseWatchlistSource('https://letterboxd.com/')).toBeNull();
		expect(parseWatchlistSource('tl-us-not-a-real-id')).toBeNull();
	});
});
