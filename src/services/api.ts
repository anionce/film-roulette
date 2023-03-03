/* import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exampleApi = createApi({
	reducerPath: 'exampleApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://api.com/' }),
	endpoints: builder => ({
		list: builder.query<[], void>({
			query: () => `/example`,
		}),
		listById: builder.query<Model, string>({
			query: id => `/example/${id}`,
		}),
	}),
});

export const { list, listById } = exampleApi;
 */
