import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

export const store = configureStore({
	reducer: {
		/* [exampleApi.reducerPath]: exampleApi.reducer, */
	},
	/* middleware: getDefaultMiddleware => getDefaultMiddleware().concat(exampleApi.middleware), */
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
