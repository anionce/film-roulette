import React from 'react';
import './NoResults.scss';
import JohnTravolta from '../../assets/img/giphy.gif';

export const NoResults = () => {
	return (
		<div className='no-results-container'>
			<img
				className='no-results-img'
				alt='no hay resultados'
				style={{ borderRadius: '4px' }}
				src={JohnTravolta}
			/>
		</div>
	);
};
