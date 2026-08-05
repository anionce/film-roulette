import { FilterArguments } from '../constants/filters';
import { AvailabilityInfo, CompleteMovie, CountryResults } from '../models/MovieResponse';
import { STREAMING_ID } from '../constants/streamingServices';
import { MovieEra, mapValueToEraRange } from '../constants/era';

export const RANDOM_PAGE_LIMIT = 40;
export const MIN_RANDOM_PAGE = 5;

export const getRandomValue = () => {
	return Math.floor(Math.random() * (RANDOM_PAGE_LIMIT - MIN_RANDOM_PAGE + 1)) + MIN_RANDOM_PAGE;
};

export const getRandomStartPage = (totalPages: number): number => {
	if (totalPages <= MIN_RANDOM_PAGE) {
		return 1;
	}

	return Math.floor(Math.random() * (totalPages - MIN_RANDOM_PAGE + 1)) + MIN_RANDOM_PAGE;
};

const SKIP_TOP_PAGES_THRESHOLD = 20;

export const getSearchStartPage = (totalPages: number): number => {
	if (totalPages > SKIP_TOP_PAGES_THRESHOLD) {
		return getRandomStartPage(totalPages);
	}

	return Math.floor(Math.random() * totalPages) + 1;
};

export const shuffleArray = (array: CompleteMovie[]) => {
	return [...array].sort(() => Math.random() - 0.5);
};

// "Included with a subscription" categories a movie can be watched under, without paying extra.
// Excludes rent/buy, which are pay-per-title and not what "available on X" implies for this app.
const getIncludedAvailability = (availability: CountryResults | undefined): AvailabilityInfo[] => [
	...(availability?.flatrate ?? []),
	...(availability?.free ?? []),
	...(availability?.ads ?? []),
];

export const hasVODAvailability = (movie: CompleteMovie): boolean => {
	const availability = movie.streamingData?.data;

	return !!(
		getIncludedAvailability(availability).length ||
		availability?.rent?.length ||
		availability?.buy?.length
	);
};

// Users asked for movies from the countries they actually recognize (US/UK, Spain, France,
// Italy, Germany) and to only see other origins when they're genuinely mainstream hits,
// rather than obscure indie/Eastern-European titles that happen to pass the vote thresholds.
const PREFERRED_ORIGIN_LANGUAGES = ['en', 'es', 'fr', 'it', 'de'];
const SUPER_POPULAR_VOTE_COUNT_THRESHOLD = 2000;

export const isFromPreferredOrigin = (movie: CompleteMovie): boolean =>
	PREFERRED_ORIGIN_LANGUAGES.includes(movie.original_language) || movie.vote_count >= SUPER_POPULAR_VOTE_COUNT_THRESHOLD;

// Defensive re-check: TMDB's own primary_release_date filter can occasionally still let a
// movie through (data quirks, retried/partial requests), so re-validate client-side too
// rather than trusting the API's date filtering alone.
export const isWithinEraRange = (movie: CompleteMovie, era: MovieEra | null): boolean => {
	const range = mapValueToEraRange(era);

	if (!range) {
		return true;
	}

	const releaseDate = movie.release_date;

	if (!releaseDate) {
		return false;
	}

	if (range.gte && releaseDate < range.gte) {
		return false;
	}

	if (range.lte && releaseDate > range.lte) {
		return false;
	}

	return true;
};

export const filterAvailableMovies = (movies: CompleteMovie[]): CompleteMovie[] =>
	movies.filter(movie => hasVODAvailability(movie) && isFromPreferredOrigin(movie));

export const filterMovies = (movies: CompleteMovie[], filters: FilterArguments) => {
	const filteredResults = movies.filter(movie => {
		if (!hasVODAvailability(movie)) {
			return false;
		}

		if (!isFromPreferredOrigin(movie)) {
			return false;
		}

		if (!isWithinEraRange(movie, filters.era)) {
			return false;
		}

		if (!filters.streaming) {
			return true;
		}

		const availableProviderIds = new Set(
			getIncludedAvailability(movie.streamingData?.data).map((platform: AvailabilityInfo) => platform.provider_id)
		);

		return filters.streaming.some(streamingPlatform => availableProviderIds.has(STREAMING_ID[streamingPlatform]));
	});

	return filteredResults;
};
