import React from 'react';
import './Card.scss';

export type CardProps = {
	example: any;
};

export const Card = ({ example }: CardProps) => {
	return <div className='card'></div>;
};
