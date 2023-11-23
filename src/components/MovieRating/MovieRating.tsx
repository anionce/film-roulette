import React from 'react';
import { Movie } from '../../models/MovieResponse';
import { RoundedStar, Rating as Stars } from '@smastrom/react-rating';

export type MovieRatingProps = {
	currentMovie: Movie;
};

export const MovieRating = ({ currentMovie }: MovieRatingProps) => {
	const cleanRating = Number((currentMovie?.vote_average / 2).toFixed(2));
	const ratingSize = 130;

	const myStyles = {
		itemShapes: RoundedStar,
		activeFillColor: '#03193a',
		inactiveFillColor: '#a1c2f3',
		inactiveStrokeColor: 'white',
		activeStrokeColor: 'white',
		itemStrokeWidth: 0.5,
	};

	return (
		<div className='rating-container'>
			<Stars readOnly={true} style={{ maxWidth: ratingSize }} value={cleanRating} itemStyles={myStyles} />
		</div>
	);
};
