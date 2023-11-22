import React, { ChangeEvent, useState } from 'react';
import './Home.scss';

import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { FilterType, filterTypes } from '../../../constants/filters';
import { PlayButton } from '../../components/PlayButton/PlayButton';
import { FiltersModal } from '../../components/FiltersModal/FiltersModal';
import { MovieGenre } from '../../../constants/genre';
import { MovieRuntime } from '../../../constants/runtime';
import { StreamingServices } from '../../../constants/streamingServices';

export type FilterArguments = {
	genre: MovieGenre | null;
	duration: MovieRuntime | null;
	streaming: StreamingServices[] | null;
};

type ModalOpen = {
	[FilterType.Genre]: boolean;
	[FilterType.Duration]: boolean;
	[FilterType.Streaming]: boolean;
};

export type HomeProps = {
	filters: FilterArguments;
	onButtonClick: any;
	setFilters: any;
};

export const Home = ({ filters, onButtonClick, setFilters }: HomeProps) => {
	const [open, setOpen] = useState<ModalOpen>({
		[FilterType.Genre]: false,
		[FilterType.Duration]: false,
		[FilterType.Streaming]: false,
	});

	const openModal = (type: FilterType): void => {
		setOpen(prev => ({ ...prev, [type]: true }));
	};

	const closeModal = (type: FilterType) => {
		setOpen(prev => ({ ...prev, [type]: false }));
	};

	const onSelectGenre = (event: React.MouseEvent<HTMLButtonElement>) => {
		onGenreChange(event);
		setTimeout(() => closeModal(FilterType.Genre), 250);
	};

	const onGenreChange = (event: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): void => {
		const value = event.currentTarget.getAttribute('data-value');
		setFilters((prev: FilterArguments) => ({ ...prev, genre: value as MovieGenre }));
	};

	const getSelect = (type: FilterType) => {
		const options = {
			[FilterType.Genre]: onSelectGenre,
			[FilterType.Duration]: onSelectDuration,
			[FilterType.Streaming]: selectedServicesOnChange,
		};

		return options[type];
	};

	const onDurationChange = (event: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): void => {
		const value = event.currentTarget.getAttribute('data-value');
		setFilters((prev: FilterArguments) => ({ ...prev, duration: value as MovieRuntime }));
	};

	const onSelectDuration = (event: React.MouseEvent<HTMLButtonElement>) => {
		onDurationChange(event);
		setTimeout(() => closeModal(FilterType.Duration), 250);
	};

	const selectedServicesOnChange = (event: ChangeEvent<HTMLInputElement>, newServices: StreamingServices[]): void => {
		setFilters((prev: FilterArguments) => ({ ...prev, streaming: newServices }));
	};

	const isDisabled = !filters.streaming?.length;

	return (
		<div className='home-mobile-container'>
			<h2 className='home-mobile-title'>¡Hola!</h2>
			<div className='home-mobile-subtitle'>
				Elige qué película ver según el género que te apetezca y el tiempo que tengas &#129303;
			</div>
			<ButtonGroup filters={filters} openModal={openModal} />
			<PlayButton filters={filters} onButtonClick={onButtonClick} />
			{filterTypes.map(type => {
				return (
					<FiltersModal
						key={`filter-modal-${type}`}
						open={open[type]}
						filterType={type}
						closeModal={closeModal}
						onSelect={getSelect(type)}
						filters={filters.streaming}
						isButtonDisabled={isDisabled}
					/>
				);
			})}
		</div>
	);
};
