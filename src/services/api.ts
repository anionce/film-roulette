import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIMovieResponse, CountryCodes, CountryResults, MovieDetail, StreamingDetail } from '../models/MovieResponse';
import {
	API_KEY,
	BASE_URL,
	DISCOVER,
	LANGUAGE,
	MINIMUM_VOTE,
	PLUTO_TV_MINIMUM_VOTE,
	PLUTO_TV_POPULARITY_VALUE,
	PLUTO_TV_PROVIDER_ID,
	POPULARITY_VALUE,
	TAG,
	TOKEN,
} from './endpoints';
import { DetailMovieArgs, GetMovieArgs } from '../models/APIArgs';

export const moviesApi = createApi({
	reducerPath: 'moviesApi',
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: headers => {
			headers.set('Authorization', `Bearer ${TOKEN}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getMovies: builder.query<APIMovieResponse, GetMovieArgs>({
			query: ({ runtime, genres, page, streamingServices, language, releaseDateGte, releaseDateLte }) => {
				const streamingServicesQuery = streamingServices ? `&watch_region=ES` : '';
				const releaseDateQuery = `${releaseDateGte ? `&primary_release_date.gte=${releaseDateGte}` : ''}${
					releaseDateLte ? `&primary_release_date.lte=${releaseDateLte}` : ''
				}`;
				const runtimeQuery = runtime ? `&with_runtime.lte=${runtime}` : '';
				const isPlutoTvOnly = streamingServices === PLUTO_TV_PROVIDER_ID;
				const voteCountThreshold = isPlutoTvOnly ? PLUTO_TV_POPULARITY_VALUE : POPULARITY_VALUE;
				const voteAverageThreshold = isPlutoTvOnly ? PLUTO_TV_MINIMUM_VOTE : MINIMUM_VOTE;

				return `${DISCOVER}/${TAG}?api_key=${API_KEY}&language=${language ?? LANGUAGE}&include_adult=false${runtimeQuery}&with_genres=${genres}&vote_count.gte=${voteCountThreshold}&vote_average.gte=${voteAverageThreshold}&sort_by=popularity.desc${streamingServicesQuery}&with_watch_providers=${streamingServices}${releaseDateQuery}&page=${page}`;
			},
		}),
		getRandomMovies: builder.query<APIMovieResponse, GetMovieArgs>({
			query: ({ page, language }) =>
				`${DISCOVER}/${TAG}?api_key=${API_KEY}&language=${language ?? LANGUAGE}&include_adult=false&vote_count.gte=${POPULARITY_VALUE}&vote_average.gte=${MINIMUM_VOTE}&sort_by=popularity.desc&page=${page}`,
		}),
		getDetails: builder.query<MovieDetail, DetailMovieArgs>({
			query: ({ id, language }) => `${TAG}/${id}?api_key=${API_KEY}&language=${language ?? LANGUAGE}`,
			transformResponse: response => response as MovieDetail,
		}),
		getStreamingDetails: builder.query<CountryResults, DetailMovieArgs>({
			query: ({ id }) => `${TAG}/${id}/watch/providers`,
			transformResponse: response => (response as StreamingDetail).results[CountryCodes.ES],
		}),
	}),
});

export const { useLazyGetMoviesQuery, useLazyGetRandomMoviesQuery, useLazyGetDetailsQuery, useLazyGetStreamingDetailsQuery } =
	moviesApi;
