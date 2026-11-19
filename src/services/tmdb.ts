import {
	CountryCodes,
	type APIMovieResponse,
	type CompleteMovie,
	type Movie,
	type MovieDetail,
	type StreamingDetail,
} from '../models/MovieResponse';
import { GENRES_EXCLUDED_UNLESS_SELECTED } from '../constants/genre';

const BASE_URL = 'https://api.themoviedb.org/3/';
const TOKEN = import.meta.env.VITE_TOKEN;
const WATCH_REGION = CountryCodes.ES;

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 300;
const NOT_FOUND = 404;

const POPULARITY_VALUE = 100;
const MINIMUM_VOTE = 6.0;
const PLUTO_TV_PROVIDER_ID = '300';
const PLUTO_TV_POPULARITY_VALUE = 20;
const PLUTO_TV_MINIMUM_VOTE = 5.5;

export type DiscoverArgs = {
	page: number;
	language: string;
	runtime?: number;
	genres?: number[] | null;
	streamingServices?: string | null;
	releaseDateGte?: string;
	releaseDateLte?: string;
};

export class TmdbError extends Error {
	readonly status: number;

	constructor(status: number) {
		super(`TMDB request failed with status ${status}`);
		this.status = status;
	}
}

const wait = (ms: number, signal?: AbortSignal) =>
	new Promise<void>((resolve, reject) => {
		const timer = setTimeout(resolve, ms);
		signal?.addEventListener('abort', () => {
			clearTimeout(timer);
			reject(signal.reason);
		});
	});

const fetchTmdb = async <T>(path: string, params: URLSearchParams, signal?: AbortSignal): Promise<T> => {
	for (let attempt = 0; ; attempt++) {
		try {
			const response = await fetch(`${BASE_URL}${path}?${params}`, {
				headers: { Authorization: `Bearer ${TOKEN}` },
				signal,
			});
			if (response.ok) return (await response.json()) as T;
			throw new TmdbError(response.status);
		} catch (error) {
			const isFinal =
				signal?.aborted || attempt >= MAX_RETRIES || (error instanceof TmdbError && error.status === NOT_FOUND);
			if (isFinal) throw error;
			await wait(RETRY_BASE_DELAY_MS * 2 ** attempt, signal);
		}
	}
};

const qualityThresholds = (streamingServices?: string | null) => {
	const isPlutoTvOnly = streamingServices === PLUTO_TV_PROVIDER_ID;
	return {
		voteCount: isPlutoTvOnly ? PLUTO_TV_POPULARITY_VALUE : POPULARITY_VALUE,
		voteAverage: isPlutoTvOnly ? PLUTO_TV_MINIMUM_VOTE : MINIMUM_VOTE,
	};
};

export const discoverParams = (args: DiscoverArgs): URLSearchParams => {
	const { voteCount, voteAverage } = qualityThresholds(args.streamingServices);
	const params = new URLSearchParams({
		language: args.language,
		include_adult: 'false',
		'vote_count.gte': String(voteCount),
		'vote_average.gte': String(voteAverage),
		sort_by: 'popularity.desc',
		page: String(args.page),
	});

	if (args.runtime) params.set('with_runtime.lte', String(args.runtime));
	if (args.genres?.length) {
		params.set('with_genres', args.genres.join(','));
		const excludedGenres = GENRES_EXCLUDED_UNLESS_SELECTED.filter(id => !args.genres?.includes(id));
		if (excludedGenres.length) params.set('without_genres', excludedGenres.join(','));
	}
	if (args.streamingServices) {
		params.set('watch_region', WATCH_REGION);
		params.set('with_watch_providers', args.streamingServices);
	}
	if (args.releaseDateGte) params.set('primary_release_date.gte', args.releaseDateGte);
	if (args.releaseDateLte) params.set('primary_release_date.lte', args.releaseDateLte);

	return params;
};

export const discoverMovies = (args: DiscoverArgs, signal?: AbortSignal) =>
	fetchTmdb<APIMovieResponse>('discover/movie', discoverParams(args), signal);

const getMovieDetail = (id: number, language: string, signal?: AbortSignal) =>
	fetchTmdb<MovieDetail>(`movie/${id}`, new URLSearchParams({ language }), signal);

const getWatchProviders = async (id: number, signal?: AbortSignal) =>
	(await fetchTmdb<StreamingDetail>(`movie/${id}/watch/providers`, new URLSearchParams(), signal)).results[WATCH_REGION];

const unlessFailed = <T>(promise: Promise<T>) => promise.catch(() => undefined);

export const withDetails = (movies: Movie[], language: string, signal?: AbortSignal): Promise<CompleteMovie[]> =>
	Promise.all(
		movies.map(async movie => {
			const [detail, streaming] = await Promise.all([
				unlessFailed(getMovieDetail(movie.id, language, signal)),
				unlessFailed(getWatchProviders(movie.id, signal)),
			]);
			return { ...movie, detail, streaming };
		})
	);
