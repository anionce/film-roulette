import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { moviesApi } from '../services/api';

export const store = configureStore({
	reducer: {
		[moviesApi.reducerPath]: moviesApi.reducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(moviesApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
