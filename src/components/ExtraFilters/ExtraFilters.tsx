import React, { useEffect, useState } from 'react';
import './ExtraFilters.scss';
import { mapValueToStreamingService, streamingServices } from '../../constants/streamingServices';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
	QueryDefinition,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';
import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { APIMovieResponse } from '../../models/MovieResponse';
import { mapValueToGenre } from '../../constants/genre';
import { mapValueToMovieRuntime } from '../../constants/runtime';
import { FilterArguments } from '../../pages/Home/Home';
import { RandomMovieArgs } from '../../models/APIArgs';

export type ExtraFiltersProp = {
	setActualPage: React.Dispatch<React.SetStateAction<number>>;
	triggerMovies: LazyQueryTrigger<
		QueryDefinition<
			RandomMovieArgs,
			BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
			'Movies',
			APIMovieResponse,
			'moviesApi'
		>
	>;
	selectedServicesOnChange: (event: React.MouseEvent<HTMLElement>, newServices: string[]) => void;
	filters: FilterArguments;
};

export const ExtraFilters = ({ selectedServicesOnChange, filters, triggerMovies }: ExtraFiltersProp) => {
	const [showContent, toggleShowContent] = useState<boolean>(false);

	useEffect(() => {
		if (filters.genre && filters.duration) {
			triggerMovies({
				runtime: mapValueToMovieRuntime(filters.duration),
				genres: mapValueToGenre(filters.genre),
				streamingServices: mapValueToStreamingService(filters.streaming),
			});
		}

		// eslint-disable-next-line
	}, [filters]);

	const arrowIconOnClick = () => toggleShowContent(prev => !prev);

	return (
		<div className='extra-filters-container'>
			<div className='extra-filters-text-container' onClick={arrowIconOnClick}>
				<span className='extra-filters-text'>Disponible en... </span>
				<div className='extra-filters-icon'>
					{showContent ? <ArrowDropUpIcon fontSize='small' /> : <ArrowDropDownIcon fontSize='small' />}
				</div>
			</div>

			<ToggleButtonGroup
				style={{ visibility: showContent ? 'visible' : 'hidden' }}
				value={filters.streaming}
				onChange={selectedServicesOnChange}
				size='small'>
				{streamingServices.map(streamingService => (
					<ToggleButton
						disableRipple
						sx={{
							backgroundColor: 'transparent',
							padding: '1px',
							border: 'none',
							'&.Mui-selected': {
								backgroundColor: 'transparent',
								'& .filter-streaming-logo': {
									opacity: 1,
								},
								'&:hover': { backgroundColor: 'transparent' },
							},
							'&:hover': { backgroundColor: 'transparent' },
						}}
						key={streamingService.name}
						value={streamingService.name}
						aria-label={streamingService.name}>
						<img
							className='filter-streaming-logo'
							alt={streamingService.name}
							src={streamingService.logo}
						/>
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</div>
	);
};
