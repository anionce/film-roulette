import React from 'react';
import './NoResults.scss';
import JohnTravolta from '../../assets/img/giphy.gif';

export const NoResults = () => {
	return (
		<img className='no-results-img' alt='no hay resultados' style={{ borderRadius: '4px' }} src={JohnTravolta} />
	);
};
