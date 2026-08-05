import { Movie } from '../../models/MovieResponse';

export type MovieRatingProps = {
	currentMovie: Movie;
};

export const MovieRating = ({ currentMovie }: MovieRatingProps) => {
	const cleanRating = (currentMovie?.vote_average ?? 0).toFixed(1);

	return (
		<div className='score-badge'>
			<span className='score-star'>★</span>
			<span className='score-value'>{cleanRating}</span>
		</div>
	);
};
