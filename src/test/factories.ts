import { STREAMING_ID, type StreamingServices } from '../constants/streamingServices';
import type { CompleteMovie, Movie } from '../models/MovieResponse';

export const toAvailability = (services: StreamingServices[], providerName?: string) =>
	services.map(service => ({
		provider_name: providerName ?? service,
		display_priority: 0,
		logo_path: '',
		provider_id: STREAMING_ID[service],
	}));

export const makeMovie = (overrides: Partial<Movie> = {}): Movie => ({
	adult: false,
	backdrop_path: '',
	genre_ids: [],
	id: 1,
	original_language: 'en',
	original_title: 'Movie',
	overview: 'A movie.',
	popularity: 10,
	poster_path: '/poster.jpg',
	release_date: '2024-01-01',
	title: 'Movie',
	video: false,
	vote_average: 7.4,
	vote_count: 500,
	...overrides,
});

export const makeCompleteMovie = (
	id: number,
	platforms: StreamingServices[] = [],
	overrides: Partial<CompleteMovie> = {}
): CompleteMovie => ({
	...makeMovie({ id, title: `Movie ${id}` }),
	streaming: { link: '', flatrate: toAvailability(platforms) },
	...overrides,
});
