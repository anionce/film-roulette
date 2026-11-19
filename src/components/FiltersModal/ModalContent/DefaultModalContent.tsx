import { FilterType } from '../../../constants/filters';
import { MAX_GENRES } from '../../../constants/genre';
import { getOptionsForSelector } from '../../../constants/selector';
import { useLanguage } from '../../../i18n/useLanguage';

type DefaultModalContentProps = {
	filterType: FilterType;
	selectedValues: string[];
	onSelect: (value: string) => void;
};

export const DefaultModalContent = ({ filterType, selectedValues, onSelect }: DefaultModalContentProps) => {
	const { t, language } = useLanguage();
	const isGenre = filterType === FilterType.Genre;
	const isMaxReached = isGenre && selectedValues.length >= MAX_GENRES;
	const title = isGenre
		? t.genreModalTitle(MAX_GENRES)
		: filterType === FilterType.Era
			? t.eraModalTitle
			: t.durationModalTitle;

	return (
		<div className='modal-content-container'>
			<p className='modal-content-title'>{title}</p>
			{isMaxReached && <p className='modal-content-hint'>{t.genreMaxHint(MAX_GENRES)}</p>}
			<div className={`genre-grid ${isGenre ? 'genre-grid-plain' : ''}`}>
				{getOptionsForSelector(filterType, language).map(({ text, value, emoji }) => {
					const isSelected = selectedValues.includes(value);
					const isDisabled = isMaxReached && !isSelected;

					return (
						<button
							type='button'
							key={value}
							onClick={() => onSelect(value)}
							disabled={isDisabled}
							aria-pressed={isSelected}
							className={`genre-tile ${isSelected ? 'selected' : ''} ${isDisabled ? 'tile-disabled' : ''}`}
						>
							{!isGenre && <span className='emoji'>{emoji}</span>}
							{text}
						</button>
					);
				})}
			</div>
		</div>
	);
};
