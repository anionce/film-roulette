import React from 'react';
import './Plot.scss';
import { useMediaQuery } from 'react-responsive';
import { MOVIE_IMDB_PATH } from '../../constants/movie';

export type PlotProps = {
	plot: string;
	dataIMDB: string;
};

export const Plot = ({ plot, dataIMDB }: PlotProps) => {
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1100px)' });

	const getTruncatedPlot = () => {
		let trimmedString;
		if (isTabletOrMobile) {
			trimmedString = plot.substring(0, 200);
		} else trimmedString = plot.substring(0, 350);

		trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

		return `${trimmedString}... `;
	};

	return (
		<div className='plot-container'>
			<p className='plot-text'>
				{getTruncatedPlot()}
				<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
					+
				</a>
			</p>
		</div>
	);
};
