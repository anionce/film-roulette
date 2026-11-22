import { describe, expect, it } from 'vitest';
import { MovieEra } from '../constants/era';
import { MovieGenre } from '../constants/genre';
import { MovieRuntime } from '../constants/runtime';
import { StreamingServices } from '../constants/streamingServices';
import type { CompleteMovie } from '../models/MovieResponse';
import { makeCompleteMovie, makeMovie } from '../test/factories';
import { EMPTY_FILTERS } from './filters';
import { filterWatchlistMovies, matchesCheapFilters } from './watchlist';

const withRuntime = (movie: CompleteMovie, runtime: number | null): CompleteMovie => ({
	...movie,
	detail: { runtime } as CompleteMovie['detail'],
});

describe('matchesCheapFilters', () => {
	it('accepts everything without filters', () => {
		expect(matchesCheapFilters(makeMovie(), EMPTY_FILTERS)).toBe(true);
	});

	it('needs every selected genre', () => {
		const movie = makeMovie({ genre_ids: [27, 53] });

		expect(matchesCheapFilters(movie, { ...EMPTY_FILTERS, genre: [MovieGenre.Horror] })).toBe(true);
		expect(matchesCheapFilters(movie, { ...EMPTY_FILTERS, genre: [MovieGenre.Horror, MovieGenre.Thriller] })).toBe(true);
		expect(matchesCheapFilters(movie, { ...EMPTY_FILTERS, genre: [MovieGenre.Horror, MovieGenre.Comedy] })).toBe(false);
	});

	it('checks the era', () => {
		const movie = makeMovie({ release_date: '1995-06-01' });

		expect(matchesCheapFilters(movie, { ...EMPTY_FILTERS, era: MovieEra.Decade90 })).toBe(true);
		expect(matchesCheapFilters(movie, { ...EMPTY_FILTERS, era: MovieEra.Decade80 })).toBe(false);
	});
});

describe('filterWatchlistMovies', () => {
	it('keeps only films that can be watched in Spain', () => {
		const available = makeCompleteMovie(1, [StreamingServices.Netflix]);
		const unavailable = makeCompleteMovie(2);

		expect(filterWatchlistMovies([available, unavailable], EMPTY_FILTERS)).toEqual([available]);
	});

	it('does not require a popular or preferred origin', () => {
		const obscure = makeCompleteMovie(1, [StreamingServices.Netflix], { original_language: 'ko', vote_count: 10 });

		expect(filterWatchlistMovies([obscure], EMPTY_FILTERS)).toEqual([obscure]);
	});

	it('filters by selected platforms', () => {
		const onNetflix = makeCompleteMovie(1, [StreamingServices.Netflix]);
		const onDisney = makeCompleteMovie(2, [StreamingServices.Disney]);

		expect(filterWatchlistMovies([onNetflix, onDisney], { ...EMPTY_FILTERS, streaming: [StreamingServices.Disney] })).toEqual(
			[onDisney]
		);
	});

	it('filters by maximum runtime and drops films with unknown runtime', () => {
		const short = withRuntime(makeCompleteMovie(1, [StreamingServices.Netflix]), 85);
		const long = withRuntime(makeCompleteMovie(2, [StreamingServices.Netflix]), 170);
		const unknown = withRuntime(makeCompleteMovie(3, [StreamingServices.Netflix]), null);
		const withoutDetail = makeCompleteMovie(4, [StreamingServices.Netflix]);

		const result = filterWatchlistMovies([short, long, unknown, withoutDetail], {
			...EMPTY_FILTERS,
			duration: MovieRuntime.Short,
		});

		expect(result).toEqual([short]);
	});
});
