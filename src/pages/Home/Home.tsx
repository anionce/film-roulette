import React, { ChangeEvent, useState } from 'react';
import './Home.scss';

import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { FilterArguments, FilterType, ModalOpen, filterTypes } from '../../constants/filters';
import { PlayButton } from '../../components/PlayButton/PlayButton';
import { FiltersModal } from '../../components/FiltersModal/FiltersModal';
import { MAX_GENRES, MovieGenre } from '../../constants/genre';
import { MovieRuntime } from '../../constants/runtime';
import { StreamingServices } from '../../constants/streamingServices';
import { MovieEra } from '../../constants/era';
import { Introduction } from '../../components/Introduction/Introduction';
import { RandomButton } from '../../components/RandomButton/RandomButton';
import { LanguageToggle } from '../../components/LanguageToggle/LanguageToggle';

export type HomeProps = {
	filters: FilterArguments;
	onButtonClick: (random?: boolean) => void;
	setFilters: React.Dispatch<React.SetStateAction<FilterArguments>>;
};

export const Home = ({ filters, onButtonClick, setFilters }: HomeProps) => {
	const [open, setOpen] = useState<ModalOpen>({
		[FilterType.Genre]: false,
		[FilterType.Duration]: false,
		[FilterType.Streaming]: false,
		[FilterType.Era]: false,
	});

	const openModal = (type: FilterType): void => {
		setOpen(prev => ({ ...prev, [type]: true }));
	};

	const closeModal = (type: FilterType) => {
		setOpen(prev => ({ ...prev, [type]: false }));
	};

	const onSelectGenre = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = event.currentTarget.getAttribute('data-value') as MovieGenre;

		setFilters((prev: FilterArguments) => {
			const currentGenres = prev.genre ?? [];
			const isAlreadySelected = currentGenres.includes(value);

			let nextGenres: MovieGenre[];
			if (isAlreadySelected) {
				nextGenres = currentGenres.filter(genre => genre !== value);
			} else if (currentGenres.length < MAX_GENRES) {
				nextGenres = [...currentGenres, value];
			} else {
				nextGenres = currentGenres;
			}

			return { ...prev, genre: nextGenres.length ? nextGenres : null };
		});
	};

	const getSelect = (type: FilterType) => {
		const options = {
			[FilterType.Genre]: onSelectGenre,
			[FilterType.Duration]: onDurationChange,
			[FilterType.Streaming]: selectedServicesOnChange,
			[FilterType.Era]: onEraChange,
		};

		return options[type];
	};

	const onDurationChange = (event: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): void => {
		const value = event.currentTarget.getAttribute('data-value');
		setFilters((prev: FilterArguments) => ({ ...prev, duration: value as MovieRuntime }));
	};

	const onEraChange = (event: React.MouseEvent<HTMLButtonElement>): void => {
		const value = event.currentTarget.getAttribute('data-value');
		setFilters((prev: FilterArguments) => ({ ...prev, era: value as MovieEra }));
	};

	const selectedServicesOnChange = (event: ChangeEvent<HTMLInputElement>, newServices: StreamingServices[]): void => {
		setFilters((prev: FilterArguments) => ({ ...prev, streaming: newServices }));
	};

	const isDisabled = !filters.streaming?.length;

	return (
		<div className='home-mobile-container'>
			<div className='home-top-bar'>
				<LanguageToggle />
			</div>
			<Introduction />
			<ButtonGroup filters={filters} openModal={openModal} />
			<div className='action-button-container'>
				<PlayButton filters={filters} onButtonClick={onButtonClick} />
				<RandomButton filters={filters} onButtonClick={onButtonClick} />
			</div>
			{filterTypes.map(type => {
				const selectedValue =
					type === FilterType.Genre
						? filters.genre
						: type === FilterType.Duration
						? filters.duration
						: type === FilterType.Era
						? filters.era
						: null;

				return (
					<FiltersModal
						key={`filter-modal-${type}`}
						open={open[type]}
						filterType={type}
						closeModal={closeModal}
						onSelect={getSelect(type)}
						filters={filters.streaming}
						selectedValue={selectedValue}
						isButtonDisabled={isDisabled}
					/>
				);
			})}
		</div>
	);
};
