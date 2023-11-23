import React from 'react';
import { Link } from 'react-router-dom';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import './PlayButton.scss';
import { FilterArguments } from '../../constants/filters';

export type PlayButtonProps = {
	filters: FilterArguments;
	onButtonClick: () => void;
};

export const PlayButton = ({ filters, onButtonClick }: PlayButtonProps) => {
	const shouldShowButton = filters.duration && filters.genre;

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			onButtonClick();
		}
	};
	return (
		<div className='mobile-play-button-container'>
			{shouldShowButton && (
				<Link to='/movie'>
					<div onClick={onButtonClick} onKeyDown={handleKeyPress} className='mobile-play-button'>
						<PlayCircleIcon htmlColor='#db3259' />
					</div>
				</Link>
			)}
		</div>
	);
};
