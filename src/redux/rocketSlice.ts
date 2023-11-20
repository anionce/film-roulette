/* import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../models/MovieResponse';

export type filmRouleteSliceState = { randomMovie: Movie | undefined };

export const rocketInitialState: filmRouleteSliceState = {
	randomMovie: undefined,
};

export const rocketSlice = createSlice({
	name: 'rocketSlice',
	initialState: rocketInitialState,
	reducers: {
		getRandomMovie(state, action: PayloadAction<Movie>) {
			return state.randomMovie;
		},
	},
});

export const { getRandomMovie } = rocketSlice.actions;
 */
