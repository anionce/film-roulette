import type { FilterArguments } from '../constants/filters';
import { mapValueToGenre } from '../constants/genre';
import { mapValueToMovieRuntime } from '../constants/runtime';
import type { CompleteMovie, Movie } from '../models/MovieResponse';
import { hasVODAvailability, isOnSelectedPlatforms, isWithinEraRange } from './movies';

const hasAllGenres = (movie: Movie, genreIds: number[] | null): boolean =>
	!genreIds?.length || genreIds.every(id => movie.genre_ids.includes(id));

const isWithinRuntime = (movie: CompleteMovie, maxRuntime: number | undefined): boolean => {
	if (!maxRuntime) return true;
	const runtime = movie.detail?.runtime;
	return !!runtime && runtime <= maxRuntime;
};

export const matchesCheapFilters = (movie: Movie, filters: FilterArguments): boolean =>
	hasAllGenres(movie, mapValueToGenre(filters.genre)) && isWithinEraRange(movie, filters.era);

export const filterWatchlistMovies = (movies: CompleteMovie[], filters: FilterArguments): CompleteMovie[] => {
	const maxRuntime = mapValueToMovieRuntime(filters.duration);
	return movies.filter(
		movie => hasVODAvailability(movie) && isOnSelectedPlatforms(movie, filters) && isWithinRuntime(movie, maxRuntime)
	);
};
