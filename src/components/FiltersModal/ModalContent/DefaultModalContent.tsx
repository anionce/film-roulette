import React from 'react';
import { getOptionsForSelector } from '../../../constants/selector';
import { FilterType } from '../../../constants/filters';
import { MAX_GENRES } from '../../../constants/genre';
import { useLanguage } from '../../../i18n/LanguageContext';
import '../FiltersModal.scss';

export type DefaultModalContentProps = {
	onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
	filterType: FilterType;
	selectedValue?: string | string[] | null;
};

export const DefaultModalContent = ({ onSelect, filterType, selectedValue }: DefaultModalContentProps) => {
	const { t, language } = useLanguage();
	const isGenre = filterType === FilterType.Genre;

	const selectedValues = Array.isArray(selectedValue) ? selectedValue : selectedValue ? [selectedValue] : [];
	const isMaxReached = isGenre && selectedValues.length >= MAX_GENRES;

	return (
		<div className='modal-content-container'>
			<p className='modal-content-title'>{isGenre ? t.genreModalTitle(MAX_GENRES) : t.durationModalTitle}</p>
			{isMaxReached && <p className='modal-content-hint'>{t.genreMaxHint(MAX_GENRES)}</p>}
			<div className={`genre-grid ${isGenre ? 'genre-grid-plain' : ''}`}>
				{getOptionsForSelector(filterType, language).map(({ text, value, emoji }) => {
					const isSelected = selectedValues.includes(value);
					const isDisabled = isMaxReached && !isSelected;

					return (
						<button
							onClick={onSelect}
							data-value={value}
							key={value}
							disabled={isDisabled}
							className={`genre-tile ${isSelected ? 'selected' : ''} ${isDisabled ? 'tile-disabled' : ''}`}>
							{!isGenre && <span className='emoji'>{emoji}</span>}
							{text}
						</button>
					);
				})}
			</div>
		</div>
	);
};
