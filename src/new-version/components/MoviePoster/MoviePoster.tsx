import React from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../../constants/movie';
import { Movie } from '../../../models/MovieResponse';
import './MoviePoster.scss';

export type MoviePosterProps = {
	currentMovie: Movie;
	dataIMDB: string;
	onButtonClick: any;
	onPreviousButtonClick: any;
	isDisabled: boolean;
};

export const MoviePoster = ({
	currentMovie,
	dataIMDB,
	onButtonClick,
	onPreviousButtonClick,
	isDisabled,
}: MoviePosterProps) => {
	return (
		<div className='poster-button-container'>
			<div onClick={onPreviousButtonClick} className={`button-movie-page ${isDisabled && 'button-disabled'}`}>
				<SkipPreviousIcon />
			</div>
			<div className='poster-container'>
				<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
					<img
						className='mobile-poster-img'
						alt={currentMovie?.title}
						src={`${MOVIE_POSTER_PATH}${currentMovie?.poster_path}`}
					/>
				</a>
			</div>

			<div onClick={onButtonClick} className='button-movie-page'>
				<SkipNextIcon />
			</div>
		</div>
	);
};
