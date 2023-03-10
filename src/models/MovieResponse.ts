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
