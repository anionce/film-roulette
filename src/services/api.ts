import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIMovieResponse, CountryCodes, CountryResults, MovieDetail, StreamingDetail } from '../models/MovieResponse';
import { API_KEY, BASE_URL, DISCOVER, LANGUAGE, MINIMUM_VOTE, POPULARITY_VALUE, TAG, TOKEN } from './endpoints';
import { DetailMovieArgs, RandomMovieArgs } from '../models/APIArgs';

export const moviesApi = createApi({
	reducerPath: 'moviesApi',
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: headers => {
			headers.set('Authorization', `Bearer ${TOKEN}`);

			return headers;
		},
	}),
	tagTypes: ['Movies'],
	endpoints: builder => ({
		getMovies: builder.query<APIMovieResponse, RandomMovieArgs>({
			query: ({ runtime, genres, page, streamingServices }) =>
				`${DISCOVER}/${TAG}?api_key=${API_KEY}&language=${LANGUAGE}&include_adult=false&with_runtime.lte=${runtime}&with_genres=${genres}&vote_count.gte=${POPULARITY_VALUE}&vote_average.gte=${MINIMUM_VOTE}&sort_by=popularity.desc&watch_region=ES&with_watch_providers=${streamingServices}&page=${page}`,
		}),
		getDetails: builder.query<MovieDetail, DetailMovieArgs>({
			query: ({ id }) => `${TAG}/${id}?api_key=${API_KEY}&language=${LANGUAGE}`,
			transformResponse: response => response as MovieDetail,
		}),
		getStreamingDetails: builder.query<CountryResults, DetailMovieArgs>({
			query: ({ id }) => `${TAG}/${id}/watch/providers`,
			transformResponse: response => (response as StreamingDetail).results[CountryCodes.ES],
		}),
	}),
});

export const { useLazyGetMoviesQuery, useLazyGetDetailsQuery, useLazyGetStreamingDetailsQuery } = moviesApi;
