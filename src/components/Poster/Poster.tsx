import React from 'react';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import './Poster.scss';

export type PosterProps = {
	currentMovie: Movie;
	dataIMDB: string;
};

export const Poster = ({ currentMovie, dataIMDB }: PosterProps) => {
	return (
		<div className='poster-container'>
			<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
				<img
					className='poster-img'
					alt={currentMovie?.title}
					src={`${MOVIE_POSTER_PATH}${currentMovie?.poster_path}`}
				/>
			</a>
		</div>
	);
};
