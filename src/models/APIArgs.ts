export type GetMovieArgs = {
	page?: number;
	runtime?: number | null;
	genres?: number[] | null;
	streamingServices?: string | null;
};

export type DetailMovieArgs = {
	id: number;
};
