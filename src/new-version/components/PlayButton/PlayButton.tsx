import React from 'react';
import { Link } from 'react-router-dom';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { FilterArguments } from '../../pages/Home/Home';
import './PlayButton.scss';

export type PlayButtonProps = {
	filters: FilterArguments;
	onButtonClick: () => void;
};

export const PlayButton = ({ filters, onButtonClick }: PlayButtonProps) => {
	const shouldShowButton = filters.duration && filters.genre;
	return (
		<div className='mobile-play-button-container'>
			{shouldShowButton && (
				<Link to='/movie'>
					<div onClick={onButtonClick} className='mobile-play-button'>
						<PlayCircleIcon htmlColor='#db3259' />
					</div>
				</Link>
			)}
		</div>
	);
};
