import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ERA_EMOJI, getEraLabel } from '../../../constants/era';
import { FilterType, type FilterArguments } from '../../../constants/filters';
import { getGenreLabel } from '../../../constants/genre';
import { RUNTIME_EMOJI } from '../../../constants/runtime';
import { STREAMING_LOGO } from '../../../constants/streamingServices';
import { useLanguage } from '../../../i18n/useLanguage';
import { hasSelection } from '../../../lib/filters';
import '../ButtonGroup.scss';

type FilterButtonProps = {
	filters: FilterArguments;
	filterType: FilterType;
	openModal: (type: FilterType) => void;
};

const DEFAULT_EMOJI: Record<FilterType, string> = {
	[FilterType.Genre]: '😊',
	[FilterType.Duration]: '⏱️',
	[FilterType.Streaming]: '📺',
	[FilterType.Era]: '🕰️',
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const FilterButton = ({ filters, filterType, openModal }: FilterButtonProps) => {
	const { t, language } = useLanguage();
	const isSelected = hasSelection(filters, filterType);

	const label: Record<FilterType, string> = {
		[FilterType.Genre]: t.labelGenre,
		[FilterType.Duration]: t.labelDuration,
		[FilterType.Streaming]: t.labelStreaming,
		[FilterType.Era]: t.labelEra,
	};

	const selectedEmoji =
		(filterType === FilterType.Duration && filters.duration && RUNTIME_EMOJI[filters.duration]) ||
		(filterType === FilterType.Era && filters.era && ERA_EMOJI[filters.era]) ||
		DEFAULT_EMOJI[filterType];

	const selectedValues = (): string[] => {
		if (filterType === FilterType.Duration && filters.duration) return [capitalize(filters.duration)];
		if (filterType === FilterType.Era && filters.era) return [capitalize(getEraLabel(filters.era, language))];
		return (filters.genre ?? []).map(genre => capitalize(getGenreLabel(genre, language)));
	};

	return (
		<button type='button' onClick={() => openModal(filterType)} className={`filter-button ${filterType}-button`}>
			<div className='filter-button-content'>
				<span className='filter-emoji'>{isSelected ? selectedEmoji : DEFAULT_EMOJI[filterType]}</span>
				{isSelected && filterType === FilterType.Streaming ? (
					<span className='filter-platform-summary'>
						{label[filterType]}:
						<span className='filter-platform-logos'>
							{(filters.streaming ?? []).map(service => (
								<img key={service} className='filter-platform-logo' src={STREAMING_LOGO[service]} alt={service} />
							))}
						</span>
					</span>
				) : isSelected ? (
					<span className='filter-chip-row'>
						{selectedValues().map(value => (
							<span key={value} className='filter-chip'>
								{value}
							</span>
						))}
					</span>
				) : (
					<span>{label[filterType]}</span>
				)}
			</div>
			<NavigateNextIcon />
		</button>
	);
};
