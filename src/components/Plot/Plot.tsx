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

	const truncatedPlot = () => {
		if (isTabletOrMobile) {
			return `${plot.substring(0, 200)}... `;
		}
		return `${plot.substring(0, 350)}... `;
	};

	return (
		<div className='plot-container'>
			<p className='plot-text'>
				{truncatedPlot()}
				<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
					+
				</a>
			</p>
		</div>
	);
};
