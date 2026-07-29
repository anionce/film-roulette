import React from 'react';
import { Link } from 'react-router-dom';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import './RandomButton.scss';
import { FilterArguments } from '../../constants/filters';
import { useLanguage } from '../../i18n/LanguageContext';

export type RandomButtonProps = {
	filters: FilterArguments;
	onButtonClick: (random: boolean) => void;
};

export const RandomButton = ({ filters, onButtonClick }: RandomButtonProps) => {
	const { t } = useLanguage();
	const isDisabled = !!(filters.genre?.length && filters.duration && filters.streaming?.length && filters.era);

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' && !isDisabled) {
			onButtonClick(true);
		}
	};

	const button = (
		<div
			onClick={() => !isDisabled && onButtonClick(true)}
			onKeyDown={handleKeyPress}
			role='button'
			tabIndex={isDisabled ? -1 : 0}
			aria-disabled={isDisabled}
			aria-label={t.randomAriaLabel}
			className={`mobile-play-button ${isDisabled ? 'button-disabled' : ''}`}>
			<ShuffleIcon htmlColor='#fff' />
			<span>{t.randomButton}</span>
		</div>
	);

	return <div className='mobile-play-button-container'>{isDisabled ? button : <Link to='/movie'>{button}</Link>}</div>;
};
