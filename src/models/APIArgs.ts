export type GetMovieArgs = {
	page?: number;
	runtime?: number | null;
	genres?: number[] | null;
	streamingServices?: string | null;
	language?: string;
	releaseDateGte?: string;
	releaseDateLte?: string;
};

export type DetailMovieArgs = {
	id: number;
	language?: string;
};
