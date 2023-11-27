export type APIMovieResponse = {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
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

type ProductionCompany = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};

type ProductionCountry = {
	iso_3166_1: string;
	name: string;
};

type SpokenLanguage = {
	english_name: string;
	iso_639_1: string;
	name: string;
};

export type MovieDetail = Movie & {
	belongs_to_collection: null;
	budget: number;
	homepage: string;
	imdb_id: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	revenue: number;
	spoken_languages: SpokenLanguage[];
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

export type CompleteMovie = Movie & {
	detailData: { data: MovieDetail };
	streamingData: { data: CountryResults };
};
