import { MOVIE_IMDB_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import { useLanguage } from '../../i18n/LanguageContext';
import './MoviePlot.scss';

export type MoviePlotProps = {
	currentMovie: Movie;
	dataIMDB: string;
};

export const MoviePlot = ({ currentMovie, dataIMDB }: MoviePlotProps) => {
	const { t } = useLanguage();

	return (
		<div className='plot-container'>
			<p className='plot-text'>{currentMovie.overview}</p>
			<a className='plot-read-more' href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
				{t.readMoreLabel}
				<span className='plot-read-more-arrow'>›</span>
			</a>
		</div>
	);
};
