import type { WatchlistFilm } from '../../src/models/Watchlist';
import { WatchlistError } from './watchlistError';

const GRAPHQL_URL = 'https://apis.justwatch.com/graphql';
const USER_AGENT = 'FilmRoulette/1.0 (+https://filmroulette.netlify.app)';
const PAGE_SIZE = 100;
export const MAX_JUSTWATCH_PAGES = 5;
const LIST_COUNTRY_PATTERN = /^tl-([a-z]{2})-/;

const LIST_QUERY = `query GetList($listId: ID!, $country: Country!, $language: Language!, $first: Int!, $after: String) {
	genericTitleList(id: $listId, country: $country, first: $first, after: $after, filter: {}, sortBy: POPULAR) {
		pageInfo { endCursor hasNextPage }
		edges { node { objectType content(country: $country, language: $language) { title originalReleaseYear externalIds { tmdbId } } } }
	}
}`;

type ListNode = {
	objectType: string;
	content: { title: string; originalReleaseYear: number | null; externalIds: { tmdbId: string | null } | null };
};

type ListPage = {
	pageInfo: { endCursor: string | null; hasNextPage: boolean };
	edges: { node: ListNode }[];
};

const toFilm = ({ content }: ListNode): WatchlistFilm => {
	const tmdbId = Number(content.externalIds?.tmdbId);
	return {
		title: content.title,
		year: content.originalReleaseYear ?? null,
		...(Number.isInteger(tmdbId) && tmdbId > 0 ? { tmdbId } : {}),
	};
};

const fetchPage = async (listId: string, after: string | null, fetcher: typeof fetch): Promise<ListPage> => {
	const country = LIST_COUNTRY_PATTERN.exec(listId)?.[1].toUpperCase();
	const response = await fetcher(GRAPHQL_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
		body: JSON.stringify({ query: LIST_QUERY, variables: { listId, country, language: 'en', first: PAGE_SIZE, after } }),
	});
	if (!response.ok) throw new WatchlistError('failed');
	const { data } = (await response.json()) as { data: { genericTitleList: ListPage | null } | null };
	if (!data?.genericTitleList) throw new WatchlistError('notFound');
	return data.genericTitleList;
};

export const fetchJustWatchList = async (listId: string, fetcher: typeof fetch = fetch): Promise<WatchlistFilm[]> => {
	const nodes: ListNode[] = [];
	let after: string | null = null;
	for (let page = 0; page < MAX_JUSTWATCH_PAGES; page++) {
		const { pageInfo, edges } = await fetchPage(listId, after, fetcher);
		nodes.push(...edges.map(edge => edge.node));
		if (!pageInfo.hasNextPage) break;
		after = pageInfo.endCursor;
	}
	if (!nodes.length) throw new WatchlistError('emptyOrPrivate');
	const movies = nodes.filter(node => node.objectType === 'MOVIE').map(toFilm);
	if (!movies.length) throw new WatchlistError('noMovies');
	return movies;
};
