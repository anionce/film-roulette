import React from 'react';
import { Link } from 'react-router-dom';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import './RandomButton.scss';

export type RandomButtonProps = {
	onButtonClick: (random: boolean) => void;
};

export const RandomButton = ({ onButtonClick }: RandomButtonProps) => {
	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			onButtonClick(true);
		}
	};
	return (
		<div className='mobile-play-button-container'>
			<Link to='/movie'>
				<div onClick={() => onButtonClick(true)} onKeyDown={handleKeyPress} className='mobile-play-button'>
					<ShuffleIcon htmlColor='#e35d7c' />
				</div>
			</Link>
		</div>
	);
};
