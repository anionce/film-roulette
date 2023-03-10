import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIMovieResponse, DetailMovieArgs, MovieDetail, RandomMovieArgs } from '../models/MovieResponse';
import { API_KEY, BASE_URL, DISCOVER, LANGUAGE, POPULARITY_VALUE, TAG } from './endpoints';

export const moviesApi = createApi({
	reducerPath: 'moviesApi',
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	tagTypes: ['Movies'],
	endpoints: builder => ({
		getRandomMovie: builder.query<APIMovieResponse, RandomMovieArgs>({
			query: ({ runtime, genres, page }) =>
				`${DISCOVER}/${TAG}?api_key=${API_KEY}&language=${LANGUAGE}&sort_by=vote_count.desc&with_runtime.lte=${runtime}&with_genres=${genres}&vote_count.gte=${POPULARITY_VALUE}&page=${page}`,
		}),
		getDetails: builder.query<string, DetailMovieArgs>({
			query: ({ id }) => `${TAG}/${id}?api_key=${API_KEY}&language=${LANGUAGE}`,
			transformResponse: response => (response as MovieDetail).imdb_id,
		}),
	}),
});

export const { useLazyGetRandomMovieQuery, useLazyGetDetailsQuery } = moviesApi;
