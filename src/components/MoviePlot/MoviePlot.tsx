import React from 'react';
import { MOVIE_IMDB_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import { useMediaQuery } from 'react-responsive';
import { useLanguage } from '../../i18n/LanguageContext';
import './MoviePlot.scss';

export type MoviePlotProps = {
	currentMovie: Movie;
	dataIMDB: string;
};

export const MoviePlot = ({ currentMovie, dataIMDB }: MoviePlotProps) => {
	const { t } = useLanguage();
	const isBiggerScreen = useMediaQuery({ query: '(min-width: 600px)' });

	const getTruncatedPlot = () => {
		const trimValue = isBiggerScreen ? 325 : 225;
		const trimmedString = currentMovie.overview.substring(0, trimValue);

		const result = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

		return `${result}...`;
	};

	return (
		<div className='plot-container'>
			<p className='plot-text'>{getTruncatedPlot()}</p>
			<a className='plot-read-more' href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
				{t.readMoreLabel}
				<span className='plot-read-more-arrow'>›</span>
			</a>
		</div>
	);
};
