import { filterAvailableMovies, filterMovies, getRandomStartPage, getRandomValue, shuffleArray } from './AppHelper';
import { CompleteMovie } from '../models/MovieResponse';
import { STREAMING_ID, StreamingServices } from '../constants/streamingServices';
import { FilterArguments } from '../constants/filters';

// Real TMDB data doesn't always match our display names (e.g. RTVE Play is listed as
// plain "rtve"), so tests build availability from the enum + real provider_id instead
// of a raw name string, matching how filterMovies actually matches (by provider_id).
const toAvailability = (services: StreamingServices[], providerNameOverride?: Partial<Record<StreamingServices, string>>) =>
	services.map(service => ({
		provider_name: providerNameOverride?.[service] ?? service,
		display_priority: 0,
		logo_path: '',
		provider_id: STREAMING_ID[service],
	}));

const buildMovie = (
	id: number,
	flatratePlatforms: StreamingServices[] = [],
	options: {
		rent?: StreamingServices[];
		buy?: StreamingServices[];
		free?: StreamingServices[];
		ads?: StreamingServices[];
		providerNameOverride?: Partial<Record<StreamingServices, string>>;
	} = {}
): CompleteMovie =>
	({
		id,
		title: `Movie ${id}`,
		streamingData: {
			data: {
				link: '',
				flatrate: toAvailability(flatratePlatforms, options.providerNameOverride),
				rent: options.rent ? toAvailability(options.rent) : undefined,
				buy: options.buy ? toAvailability(options.buy) : undefined,
				free: options.free ? toAvailability(options.free, options.providerNameOverride) : undefined,
				ads: options.ads ? toAvailability(options.ads, options.providerNameOverride) : undefined,
			},
		},
	} as unknown as CompleteMovie);

const baseFilters: FilterArguments = { genre: null, duration: null, streaming: null, era: null };

describe('getRandomValue', () => {
	it('skips the most popular pages while staying within the results range', () => {
		for (let i = 0; i < 50; i++) {
			const value = getRandomValue();
			expect(Number.isInteger(value)).toBe(true);
			expect(value).toBeGreaterThanOrEqual(5);
			expect(value).toBeLessThanOrEqual(40);
		}
	});
});

describe('getRandomStartPage', () => {
	it('skips the most popular pages while staying within the real total pages', () => {
		for (let i = 0; i < 50; i++) {
			const value = getRandomStartPage(100);
			expect(Number.isInteger(value)).toBe(true);
			expect(value).toBeGreaterThanOrEqual(5);
			expect(value).toBeLessThanOrEqual(100);
		}
	});

	it('can reach pages beyond the random-button page limit for large catalogs', () => {
		for (let i = 0; i < 50; i++) {
			const value = getRandomStartPage(300);
			expect(value).toBeGreaterThanOrEqual(5);
			expect(value).toBeLessThanOrEqual(300);
		}
	});

	it('falls back to page 1 when there are too few pages to skip', () => {
		expect(getRandomStartPage(3)).toBe(1);
		expect(getRandomStartPage(1)).toBe(1);
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
	it('excludes movies with no VOD availability even without a streaming filter', () => {
		const movieWithFlatrate = buildMovie(1, [StreamingServices.Netflix]);
		const movieWithoutAvailability = buildMovie(2, []);

		const result = filterMovies([movieWithFlatrate, movieWithoutAvailability], baseFilters);

		expect(result).toEqual([movieWithFlatrate]);
	});

	it('keeps movies only available to rent or buy when there is no streaming filter', () => {
		const movieToRent = buildMovie(1, [], { rent: [StreamingServices.PrimeVideo] });
		const movieToBuy = buildMovie(2, [], { buy: [StreamingServices.PrimeVideo] });
		const movieWithoutAvailability = buildMovie(3, []);

		const result = filterMovies([movieToRent, movieToBuy, movieWithoutAvailability], baseFilters);

		expect(result).toEqual([movieToRent, movieToBuy]);
	});

	it('only keeps movies available on one of the selected streaming platforms', () => {
		const movieOnNetflix = buildMovie(1, [StreamingServices.Netflix]);
		const movieOnDisney = buildMovie(2, [StreamingServices.Disney]);
		const movieWithoutStreaming = buildMovie(3, []);

		const result = filterMovies([movieOnNetflix, movieOnDisney, movieWithoutStreaming], {
			...baseFilters,
			streaming: [StreamingServices.Netflix],
		});

		expect(result).toEqual([movieOnNetflix]);
	});

	it('keeps movies matching any of multiple selected streaming platforms', () => {
		const movieOnNetflix = buildMovie(1, [StreamingServices.Netflix]);
		const movieOnDisney = buildMovie(2, [StreamingServices.Disney]);
		const movieOnHBO = buildMovie(3, [StreamingServices.HBOMax]);

		const result = filterMovies([movieOnNetflix, movieOnDisney, movieOnHBO], {
			...baseFilters,
			streaming: [StreamingServices.Netflix, StreamingServices.Disney],
		});

		expect(result).toEqual([movieOnNetflix, movieOnDisney]);
	});

	it('matches free (RTVE Play) and ad-supported (Pluto TV) availability, not just flatrate', () => {
		const movieOnRTVE = buildMovie(1, [], { free: [StreamingServices.RTVE] });
		const movieOnPlutoTV = buildMovie(2, [], { ads: [StreamingServices.PlutoTV] });
		const movieWithNoneOfThese = buildMovie(3, [StreamingServices.Netflix]);

		const result = filterMovies([movieOnRTVE, movieOnPlutoTV, movieWithNoneOfThese], {
			...baseFilters,
			streaming: [StreamingServices.RTVE, StreamingServices.PlutoTV],
		});

		expect(result).toEqual([movieOnRTVE, movieOnPlutoTV]);
	});

	it('matches by provider_id even when TMDB reports a different display name (e.g. "rtve")', () => {
		const movieOnRTVE = buildMovie(1, [], {
			free: [StreamingServices.RTVE],
			providerNameOverride: { [StreamingServices.RTVE]: 'rtve' },
		});

		const result = filterMovies([movieOnRTVE], { ...baseFilters, streaming: [StreamingServices.RTVE] });

		expect(result).toEqual([movieOnRTVE]);
	});
});

describe('filterAvailableMovies', () => {
	it('drops movies with no flatrate, free, ads, rent or buy availability', () => {
		const availableMovie = buildMovie(1, [StreamingServices.Netflix]);
		const unavailableMovie = buildMovie(2, []);

		const result = filterAvailableMovies([availableMovie, unavailableMovie]);

		expect(result).toEqual([availableMovie]);
	});
});
