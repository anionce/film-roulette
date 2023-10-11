import React from 'react';
import { Rating as Stars, RoundedStar } from '@smastrom/react-rating';
import { useMediaQuery } from 'react-responsive';

export type RatingProps = {
	rating: number;
};

export const Rating = ({ rating }: RatingProps) => {
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1100px)' });

	const myStyles = {
		itemShapes: RoundedStar,
		activeFillColor: '#ffb700',
		inactiveFillColor: '#fbf1a9',
		inactiveStrokeColor: 'white',
		activeStrokeColor: 'white',
		itemStrokeWidth: 0.5,
	};

	const ratingSize = isTabletOrMobile ? 150 : 250;

	const cleanRating = Number((rating / 2).toFixed(2));
	return <Stars readOnly={true} style={{ maxWidth: ratingSize }} value={cleanRating} itemStyles={myStyles} />;
};
