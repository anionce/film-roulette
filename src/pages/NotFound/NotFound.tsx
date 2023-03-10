import React from 'react';
import './NotFound.scss';
import notFound from '../../assets/img/notFound.jpg';

export const NotFound = () => {
	return (
		<div className='not-found-container'>
			<img alt='not-found' src={notFound}></img>
			<span>
				<a href='https://www.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_13315300.htm#query=not%20found&position=0&from_view=keyword&track=ais'>
					Image by storyset
				</a>{' '}
				on Freepik
			</span>
		</div>
	);
};
