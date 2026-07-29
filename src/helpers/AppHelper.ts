import { FilterArguments } from '../constants/filters';
import { AvailabilityInfo, CompleteMovie } from '../models/MovieResponse';

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

export const shuffleArray = (array: CompleteMovie[]) => {
	return [...array].sort(() => Math.random() - 0.5);
};

export const hasVODAvailability = (movie: CompleteMovie): boolean => {
	const availability = movie.streamingData?.data;

	return !!(availability?.flatrate?.length || availability?.rent?.length || availability?.buy?.length);
};

export const filterAvailableMovies = (movies: CompleteMovie[]): CompleteMovie[] => movies.filter(hasVODAvailability);

export const filterMovies = (movies: CompleteMovie[], filters: FilterArguments) => {
	const filteredResults = movies.filter(movie => {
		if (!hasVODAvailability(movie)) {
			return false;
		}

		if (!filters.streaming) {
			return true;
		}

		const flatratePlatforms =
			movie.streamingData?.data?.flatrate?.map((platform: AvailabilityInfo) => platform.provider_name) ?? [];

		return filters.streaming.some(streamingPlatform => flatratePlatforms.includes(streamingPlatform));
	});

	return filteredResults;
};
