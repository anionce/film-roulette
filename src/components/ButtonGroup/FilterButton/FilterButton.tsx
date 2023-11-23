import { FilterArguments, FilterType } from '../../../constants/filters';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React, { ReactNode } from 'react';
import { StreamingServices } from '../../../constants/streamingServices';
import { MovieRuntime } from '../../../constants/runtime';
import { MovieGenre } from '../../../constants/genre';
import '../ButtonGroup.scss';

export type FilterButtonProps = {
	filters: FilterArguments;
	openModal: (type: FilterType) => void;
	filterType: FilterType;
};

export const FilterButton = ({ openModal, filters, filterType }: FilterButtonProps) => {
	const cleanGenreAndDuration = (value: MovieGenre | MovieRuntime): string =>
		value.charAt(0).toUpperCase() + value.slice(1);

	const cleanStreaming = (value: StreamingServices[]): string => `${value.join(', ').substring(0, 30)}...`;

	const getButtonLabel = (): { label: string; icon: ReactNode } => {
		const labels = {
			[FilterType.Genre]: { label: 'Género', icon: <SentimentSatisfiedAltIcon /> },
			[FilterType.Duration]: { label: 'Duración', icon: <AccessAlarmIcon /> },
			[FilterType.Streaming]: { label: 'Plataformas', icon: <LiveTvIcon /> },
		};
		return labels[filterType];
	};

	const { label, icon } = getButtonLabel();

	const isGenreOrDuration = filterType === FilterType.Genre || filterType === FilterType.Duration;

	const getCleanFunction = (value: MovieGenre | MovieRuntime | StreamingServices[]) => {
		if (isGenreOrDuration) return cleanGenreAndDuration(value as MovieGenre | MovieRuntime);
		return cleanStreaming(value as StreamingServices[]);
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter') {
			openModal(filterType);
		}
	};

	return (
		<button
			onClick={() => openModal(filterType)}
			onKeyDown={handleKeyPress}
			className={`filter-button ${filterType}-button`}>
			<div className='filter-button-content'>
				{filters[filterType]
					? getCleanFunction(filters[filterType] as MovieGenre | MovieRuntime | StreamingServices[])
					: label}
				{!filters[filterType] && icon}
			</div>
			<NavigateNextIcon />
		</button>
	);
};
