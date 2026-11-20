import type { FilterArguments } from '../constants/filters';
import { mapValueToEraRange, type MovieEra } from '../constants/era';
import { STREAMING_ID } from '../constants/streamingServices';
import type { AvailabilityInfo, CompleteMovie, CountryResults, Movie } from '../models/MovieResponse';

export const RANDOM_PAGE_LIMIT = 40;
export const MIN_RANDOM_PAGE = 5;
const SKIP_TOP_PAGES_THRESHOLD = 20;
const PREFERRED_ORIGIN_LANGUAGES = ['en', 'es', 'fr', 'it', 'de'];
const SUPER_POPULAR_VOTE_COUNT_THRESHOLD = 2000;

export const randomInt = (min: number, max: number, random = Math.random): number => Math.floor(random() * (max - min + 1)) + min;

export const getRandomPage = (): number => randomInt(MIN_RANDOM_PAGE, RANDOM_PAGE_LIMIT);

export const getRandomStartPage = (totalPages: number): number =>
	totalPages <= MIN_RANDOM_PAGE ? 1 : randomInt(MIN_RANDOM_PAGE, totalPages);

export const getSearchStartPage = (totalPages: number): number =>
	totalPages > SKIP_TOP_PAGES_THRESHOLD ? getRandomStartPage(totalPages) : randomInt(1, totalPages);

export const shuffle = <T>(items: T[], random = Math.random): T[] => {
	const shuffled = [...items];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = randomInt(0, i, random);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const includedWithSubscription = (availability: CountryResults | undefined): AvailabilityInfo[] => [
	...(availability?.flatrate ?? []),
	...(availability?.free ?? []),
	...(availability?.ads ?? []),
];

export const hasVODAvailability = (movie: CompleteMovie): boolean =>
	!!(includedWithSubscription(movie.streaming).length || movie.streaming?.rent?.length || movie.streaming?.buy?.length);

export const isFromPreferredOrigin = (movie: CompleteMovie): boolean =>
	PREFERRED_ORIGIN_LANGUAGES.includes(movie.original_language) || movie.vote_count >= SUPER_POPULAR_VOTE_COUNT_THRESHOLD;

export const isWithinEraRange = (movie: CompleteMovie, era: MovieEra | null): boolean => {
	const range = mapValueToEraRange(era);
	if (!range) return true;
	if (!movie.release_date) return false;
	if (range.gte && movie.release_date < range.gte) return false;
	return !(range.lte && movie.release_date > range.lte);
};

const isOnSelectedPlatforms = (movie: CompleteMovie, filters: FilterArguments): boolean => {
	if (!filters.streaming) return true;
	const providerIds = new Set(includedWithSubscription(movie.streaming).map(platform => platform.provider_id));
	return filters.streaming.some(service => providerIds.has(STREAMING_ID[service]));
};

export const filterAvailableMovies = (movies: CompleteMovie[]): CompleteMovie[] =>
	movies.filter(movie => hasVODAvailability(movie) && isFromPreferredOrigin(movie));

export const filterMovies = (movies: CompleteMovie[], filters: FilterArguments): CompleteMovie[] =>
	filterAvailableMovies(movies).filter(movie => isWithinEraRange(movie, filters.era) && isOnSelectedPlatforms(movie, filters));

export const pickSearchResult = (results: Movie[], year: number | null): Movie | undefined =>
	results.find(movie => year !== null && movie.release_date.startsWith(String(year))) ?? results[0];

export const uniqueById = <T extends { id: number }>(items: T[]): T[] => [
	...new Map(items.map(item => [item.id, item])).values(),
];

export type PageCursor = {
	next: number;
	remaining: number;
};

export const nextPageWindow = (cursor: PageCursor, totalPages: number, windowSize: number) => {
	const start = cursor.next;
	const end = Math.min(start + Math.min(windowSize, cursor.remaining) - 1, totalPages);
	const remaining = cursor.remaining - (end - start + 1);
	return { start, end, cursor: { next: end >= totalPages && remaining > 0 ? 1 : end + 1, remaining } };
};
