import { filterMovies, getRandomValue, shuffleArray } from './AppHelper';
import { CompleteMovie } from '../models/MovieResponse';
import { StreamingServices } from '../constants/streamingServices';
import { FilterArguments } from '../constants/filters';

const buildMovie = (id: number, flatratePlatforms: string[] = []): CompleteMovie =>
	({
		id,
		title: `Movie ${id}`,
		streamingData: {
			data: {
				link: '',
				flatrate: flatratePlatforms.map(provider_name => ({
					provider_name,
					display_priority: 0,
					logo_path: '',
					provider_id: 0,
				})),
			},
		},
	} as unknown as CompleteMovie);

const baseFilters: FilterArguments = { genre: null, duration: null, streaming: null };

describe('getRandomValue', () => {
	it('returns a valid TMDB page number within the popular-results range', () => {
		for (let i = 0; i < 50; i++) {
			const value = getRandomValue();
			expect(Number.isInteger(value)).toBe(true);
			expect(value).toBeGreaterThanOrEqual(1);
			expect(value).toBeLessThanOrEqual(40);
		}
	});
});

describe('shuffleArray', () => {
	it('returns an array with the same elements', () => {
		const movies = [buildMovie(1), buildMovie(2), buildMovie(3)];

		const shuffled = shuffleArray(movies);

		expect(shuffled).toHaveLength(movies.length);
		expect(shuffled.map(movie => movie.id).sort()).toEqual(movies.map(movie => movie.id).sort());
	});

	it('does not mutate the original array', () => {
		const movies = [buildMovie(1), buildMovie(2), buildMovie(3)];
		const original = [...movies];

		shuffleArray(movies);

		expect(movies).toEqual(original);
	});
});

describe('filterMovies', () => {
	it('returns all movies when there is no streaming filter', () => {
		const movies = [buildMovie(1, ['Netflix']), buildMovie(2, [])];

		const result = filterMovies(movies, baseFilters);

		expect(result).toEqual(movies);
	});

	it('only keeps movies available on one of the selected streaming platforms', () => {
		const movieOnNetflix = buildMovie(1, ['Netflix']);
		const movieOnDisney = buildMovie(2, ['Disney+']);
		const movieWithoutStreaming = buildMovie(3, []);

		const result = filterMovies([movieOnNetflix, movieOnDisney, movieWithoutStreaming], {
			...baseFilters,
			streaming: [StreamingServices.Netflix],
		});

		expect(result).toEqual([movieOnNetflix]);
	});

	it('keeps movies matching any of multiple selected streaming platforms', () => {
		const movieOnNetflix = buildMovie(1, ['Netflix']);
		const movieOnDisney = buildMovie(2, ['Disney+']);
		const movieOnHBO = buildMovie(3, ['HBO Max']);

		const result = filterMovies([movieOnNetflix, movieOnDisney, movieOnHBO], {
			...baseFilters,
			streaming: [StreamingServices.Netflix, StreamingServices.Disney],
		});

		expect(result).toEqual([movieOnNetflix, movieOnDisney]);
	});
});
