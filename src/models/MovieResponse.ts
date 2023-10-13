export type APIMovieResponse = {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
};

export type RandomMovieArgs = {
	page: number;
	runtime: number;
	genres: number[];
};

export type DetailMovieArgs = {
	id: number;
};

export type MovieArray = Movie[];

export type Movie = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

export type MovieDetail = Movie & {
	belongs_to_collection: null;
	budget: number;
	homepage: string;
	imdb_id: string;
	production_companies: [];
	production_countries: [];
	revenue: number;
	spoken_languages: [];
	status: string;
	tagline: string;
};

export type AvailabilityInfo = {
	display_priority: number;
	logo_path: string;
	provider_id: number;
	provider_name: string;
};

export enum CountryCodes {
	ES = 'ES',
}

type StreamingResults = Record<CountryCodes, CountryResults>;

export type CountryResults = {
	rent?: AvailabilityInfo[];
	buy?: AvailabilityInfo[];
	flatrate?: AvailabilityInfo[];
	link: string;
};

export type StreamingDetail = Movie & {
	id: number;
	results: StreamingResults;
};
