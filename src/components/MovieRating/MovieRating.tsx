import type { Movie } from '../../models/MovieResponse';

export const MovieRating = ({ movie }: { movie: Movie }) => (
	<div className='score-badge'>
		<span className='score-star'>★</span>
		<span className='score-value'>{movie.vote_average.toFixed(1)}</span>
	</div>
);
