import { MOVIE_IMDB_PATH } from '../../constants/movie';
import { useLanguage } from '../../i18n/useLanguage';
import type { Movie } from '../../models/MovieResponse';
import './MoviePlot.scss';

export const MoviePlot = ({ movie, imdbId }: { movie: Movie; imdbId?: string }) => {
	const { t } = useLanguage();

	return (
		<div className='plot-container'>
			<p className='plot-text'>{movie.overview}</p>
			<a className='plot-read-more' href={`${MOVIE_IMDB_PATH}${imdbId ?? ''}`} target='_blank' rel='noreferrer'>
				{t.readMoreLabel}
				<span className='plot-read-more-arrow'>›</span>
			</a>
		</div>
	);
};
