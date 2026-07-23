import React from 'react';
import { Link } from 'react-router-dom';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import './PlayButton.scss';
import { FilterArguments } from '../../constants/filters';
import { useLanguage } from '../../i18n/LanguageContext';

export type PlayButtonProps = {
	filters: FilterArguments;
	onButtonClick: (random: boolean) => void;
};

export const PlayButton = ({ filters, onButtonClick }: PlayButtonProps) => {
	const { t } = useLanguage();
	const isDisabled = !filters.duration || !filters.genre?.length;

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' && !isDisabled) {
			onButtonClick(false);
		}
	};

	const button = (
		<div
			onClick={() => !isDisabled && onButtonClick(false)}
			onKeyDown={handleKeyPress}
			role='button'
			tabIndex={isDisabled ? -1 : 0}
			aria-disabled={isDisabled}
			aria-label={t.searchAriaLabel}
			className={`mobile-play-button ${isDisabled ? 'button-disabled' : ''}`}>
			<PlayCircleIcon htmlColor='#fff' />
			<span>{t.searchButton}</span>
		</div>
	);

	return <div className='mobile-play-button-container'>{isDisabled ? button : <Link to='/movie'>{button}</Link>}</div>;
};
