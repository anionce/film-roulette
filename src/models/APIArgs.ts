export type RandomMovieArgs = {
	page?: number;
	runtime: number;
	genres: number[] | null;
	streamingServices: string | null;
};

export type DetailMovieArgs = {
	id: number;
};
