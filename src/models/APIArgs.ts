export type GetMovieArgs = {
	page?: number;
	runtime?: number | null;
	genres?: number[] | null;
	streamingServices?: string | null;
	language?: string;
};

export type DetailMovieArgs = {
	id: number;
	language?: string;
};
