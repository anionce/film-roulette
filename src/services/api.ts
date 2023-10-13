import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	APIMovieResponse,
	CountryCodes,
	CountryResults,
	DetailMovieArgs,
	MovieDetail,
	RandomMovieArgs,
	StreamingDetail,
} from '../models/MovieResponse';
import { API_KEY, BASE_URL, DISCOVER, LANGUAGE, MINIMUM_VOTE, POPULARITY_VALUE, TAG, TOKEN } from './endpoints';

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
		getRandomMovie: builder.query<APIMovieResponse, RandomMovieArgs>({
			query: ({ runtime, genres, page }) =>
				`${DISCOVER}/${TAG}?api_key=${API_KEY}&language=${LANGUAGE}&with_runtime.lte=${runtime}&with_genres=${genres}&vote_count.gte=${POPULARITY_VALUE}&vote_average.gte${MINIMUM_VOTE}&page=${page}`,
		}),
		getDetails: builder.query<string, DetailMovieArgs>({
			query: ({ id }) => `${TAG}/${id}?api_key=${API_KEY}&language=${LANGUAGE}`,
			transformResponse: response => (response as MovieDetail).imdb_id,
		}),
		getStreamingDetails: builder.query<CountryResults, DetailMovieArgs>({
			query: ({ id }) => `${TAG}/${id}/watch/providers`,
			transformResponse: response => (response as StreamingDetail).results[CountryCodes.ES],
		}),
	}),
});

export const { useLazyGetRandomMovieQuery, useLazyGetDetailsQuery, useLazyGetStreamingDetailsQuery } = moviesApi;
