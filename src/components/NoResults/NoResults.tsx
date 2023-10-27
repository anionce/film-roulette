import React from 'react';
import JohnTravolta from '../../assets/img/giphy.gif';

export const NoResults = () => {
	return (
		<div>
			<img alt='no hay resultados' style={{ borderRadius: '4px' }} src={JohnTravolta} />
		</div>
	);
};
