import { FilterArguments, FilterType } from '../../../constants/filters';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React from 'react';
import { StreamingServices, STREAMING_LOGO } from '../../../constants/streamingServices';
import { MovieRuntime, RUNTIME_EMOJI } from '../../../constants/runtime';
import { MovieGenre, GENRE_EMOJI } from '../../../constants/genre';
import { useLanguage } from '../../../i18n/LanguageContext';
import '../ButtonGroup.scss';

export type FilterButtonProps = {
	filters: FilterArguments;
	openModal: (type: FilterType) => void;
	filterType: FilterType;
};

const DEFAULT_EMOJI: Record<FilterType, string> = {
	[FilterType.Genre]: '😊',
	[FilterType.Duration]: '⏱️',
	[FilterType.Streaming]: '📺',
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const truncate = (value: string, maxLength: number): string =>
	value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;

export const FilterButton = ({ openModal, filters, filterType }: FilterButtonProps) => {
	const { t } = useLanguage();

	const LABEL: Record<FilterType, string> = {
		[FilterType.Genre]: t.labelGenre,
		[FilterType.Duration]: t.labelDuration,
		[FilterType.Streaming]: t.labelStreaming,
	};

	const isFilterSelected: boolean =
		filterType === FilterType.Duration ? !!filters.duration : !!(filters[filterType] as unknown[])?.length;

	const getSelectedEmoji = (): string => {
		if (filterType === FilterType.Genre) {
			const emojis = (filters.genre as MovieGenre[])?.map(value => GENRE_EMOJI[value]).join('');
			return emojis || DEFAULT_EMOJI[filterType];
		}
		if (filterType === FilterType.Duration) {
			return RUNTIME_EMOJI[filters.duration as MovieRuntime] ?? DEFAULT_EMOJI[filterType];
		}
		return DEFAULT_EMOJI[filterType];
	};

	const getSummaryText = (): string => {
		if (filterType === FilterType.Duration) {
			return capitalize(filters.duration as MovieRuntime);
		}
		return truncate((filters.genre as MovieGenre[]).map(capitalize).join(', '), 28);
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter') {
			openModal(filterType);
		}
	};

	const isStreaming = filterType === FilterType.Streaming;

	return (
		<button
			onClick={() => openModal(filterType)}
			onKeyDown={handleKeyPress}
			className={`filter-button ${filterType}-button`}>
			<div className='filter-button-content'>
				<span className='filter-emoji'>{isFilterSelected ? getSelectedEmoji() : DEFAULT_EMOJI[filterType]}</span>
				{isFilterSelected && isStreaming ? (
					<span className='filter-platform-summary'>
						{LABEL[filterType]}:
						<span className='filter-platform-logos'>
							{(filters.streaming as StreamingServices[]).map(service => (
								<img key={service} className='filter-platform-logo' src={STREAMING_LOGO[service]} alt={service} />
							))}
						</span>
					</span>
				) : isFilterSelected ? (
					<span>
						{LABEL[filterType]}: {getSummaryText()}
					</span>
				) : (
					<span>{LABEL[filterType]}</span>
				)}
			</div>
			<NavigateNextIcon />
		</button>
	);
};
