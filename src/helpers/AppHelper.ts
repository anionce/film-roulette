import { FilterArguments } from '../constants/filters';
import { AvailabilityInfo, CompleteMovie } from '../models/MovieResponse';

export const getRandomValue = () => {
	return Math.floor(Math.random() * 100);
};

export const shuffleArray = (array: CompleteMovie[]) => {
	return [...array].sort(() => Math.random() - 0.5);
};

export const filterMovies = (movies: CompleteMovie[], filters: FilterArguments) => {
	const filteredResults = movies.filter(movie => {
		if (!filters.streaming) {
			return true;
		}

		const flatratePlatforms =
			movie.streamingData?.data?.flatrate?.map((platform: AvailabilityInfo) => platform.provider_name) ?? [];

		return filters.streaming.some(streamingPlatform => flatratePlatforms.includes(streamingPlatform));
	});

	return filteredResults;
};
