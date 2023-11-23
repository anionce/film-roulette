import React from 'react';
import { MOVIE_IMDB_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import { useMediaQuery } from 'react-responsive';
import './MoviePlot.scss';

export type MoviePlotProps = {
	currentMovie: Movie;
	dataIMDB: string;
};

export const MoviePlot = ({ currentMovie, dataIMDB }: MoviePlotProps) => {
	const isBiggerScreen = useMediaQuery({ query: '(min-width: 600px)' });

	const getTruncatedPlot = () => {
		const trimValue = isBiggerScreen ? 325 : 225;
		const trimmedString = currentMovie.overview.substring(0, trimValue);

		const result = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

		return `${result}... `;
	};

	return (
		<div className='plot-container'>
			<div className='plot-box'>
				<p className='plot-text'>
					{getTruncatedPlot()}
					<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
						+
					</a>
				</p>
			</div>
		</div>
	);
};
