import React from 'react';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import './Poster.scss';

export type PosterProps = {
	randomMovie: Movie;
	dataIMDB: string;
};

export const Poster = ({ randomMovie, dataIMDB }: PosterProps) => {
	return (
		<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
			<img alt={randomMovie?.title} src={`${MOVIE_POSTER_PATH}${randomMovie?.poster_path}`} />
		</a>
	);
};
