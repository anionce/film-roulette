import React, { ChangeEvent, useState } from 'react';
import './HomeMobile.scss';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Dialog, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SelectValue, getOptionsForSelector } from '../../../constants/selector';
import CloseIcon from '@mui/icons-material/Close';
import { StreamingServices, streamingServices } from '../../../constants/streamingServices';
import { FilterArguments } from '../../../pages/Home/Home';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { APIMovieResponse, Movie } from '../../../models/MovieResponse';
import {
	QueryDefinition,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';
import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { RandomMovieArgs } from '../../../models/APIArgs';
import { Link } from 'react-router-dom';

export type HomeMobileProps = {
	onGenreChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onDurationChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
	selectedServicesOnChange: (event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void;
	filters: FilterArguments;
	setActualPage: React.Dispatch<React.SetStateAction<number>>;
	actualPage: number;
	triggerMovies: LazyQueryTrigger<
		QueryDefinition<
			RandomMovieArgs,
			BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
			'Movies',
			APIMovieResponse,
			'moviesApi'
		>
	>;
	movieResults: Movie[] | undefined;
	totalPages: number | undefined;
	setRandomMovie: React.Dispatch<React.SetStateAction<Movie[]>>;

	shouldShowFewResults: boolean;
	onButtonClick: any;
};

type ModalOpen = {
	genreModal: boolean;
	durationModal: boolean;
	streamingModal: boolean;
};

export const HomeMobile = ({
	onGenreChange,
	onDurationChange,
	selectedServicesOnChange,
	filters,
	onButtonClick,
}: HomeMobileProps) => {
	const [open, setOpen] = useState<ModalOpen>({
		genreModal: false,
		durationModal: false,
		streamingModal: false,
	});

	const openModal = (type: any) => {
		setOpen(prev => ({ ...prev, [type]: true }));
	};

	const closeModal = (type: any) => {
		setOpen(prev => ({ ...prev, [type]: false }));
	};

	const onSelectGenre = (event: React.MouseEvent<HTMLButtonElement>) => {
		onGenreChange(event);
		setTimeout(() => closeModal('genreModal'), 250);
	};

	const onSelectDuration = (event: React.MouseEvent<HTMLButtonElement>) => {
		onDurationChange(event);
		setTimeout(() => closeModal('durationModal'), 250);
	};

	const cleanGenreAndDuration = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

	const cleanStreaming = (value: StreamingServices[]): string => `${value.join(', ').substring(0, 30)}...`;

	const isDisabled = !filters.streaming?.length;

	console.log(filters.streaming);

	return (
		<div className='home-mobile-container'>
			<h2 className='home-mobile-title'>¡Hola!</h2>
			<div className='home-mobile-subtitle'>
				Elige qué película ver según el género que te apetezca y el tiempo que tengas &#129303;
			</div>
			<div className='filter-buttons-container'>
				<button onClick={() => openModal('genreModal')} className='filter-button genre-button'>
					<div className='filter-button-content'>
						{filters.genre ? cleanGenreAndDuration(filters.genre) : 'Género'}
						{!filters.genre && <SentimentSatisfiedAltIcon />}
					</div>
					<NavigateNextIcon />
				</button>
				<button onClick={() => openModal('durationModal')} className='filter-button duration-button'>
					<div className='filter-button-content'>
						{filters.duration ? filters.duration : 'Duración'}
						{!filters.duration && <ScheduleIcon />}
					</div>
					<NavigateNextIcon />
				</button>
				<button onClick={() => openModal('streamingModal')} className='filter-button streaming-button'>
					<div className='filter-button-content'>
						{filters.streaming?.length ? cleanStreaming(filters.streaming) : 'Plataformas'}
						{!filters.streaming?.length && <ScheduleIcon />}
					</div>
					<NavigateNextIcon />
				</button>
			</div>
			<div className='mobile-play-button-container'>
				{filters.duration && filters.genre && (
					<Link to='/movie'>
						<div onClick={onButtonClick} className='mobile-play-button'>
							<PlayCircleIcon htmlColor='#db3259' className='mobile-play-button' />
						</div>
					</Link>
				)}
			</div>
			<Dialog
				classes={{ container: 'dialog-container', paper: 'paper' }}
				fullScreen
				open={open.genreModal}
				onClose={() => closeModal('genreModal')}>
				<div className='selector-container'>
					<div className='exit-button' onClick={() => closeModal('genreModal')}>
						<CloseIcon />
					</div>
					<Stack spacing={{ xs: 1, sm: 2 }} direction='row' useFlexGap flexWrap='wrap'>
						{getOptionsForSelector(SelectValue.Genre).map(({ text, value }) => (
							<button onClick={onSelectGenre} data-value={text} key={value} className='select-button'>
								<div className='filter-button-content'>{text}</div>
							</button>
						))}
					</Stack>
				</div>
			</Dialog>
			<Dialog
				classes={{ container: 'dialog-container', paper: 'paper' }}
				fullScreen
				open={open.durationModal}
				onClose={() => closeModal('genreModal')}>
				<div className='selector-container'>
					<div className='exit-button' onClick={() => closeModal('durationModal')}>
						<CloseIcon />
					</div>
					<div className='filter-buttons-container'>
						{getOptionsForSelector(SelectValue.Runtime).map(({ text, value }) => (
							<button onClick={onSelectDuration} key={value} data-value={text} className='select-button'>
								<div className='filter-button-content'>{text}</div>
							</button>
						))}
					</div>
				</div>
			</Dialog>
			<Dialog
				classes={{ container: 'dialog-container', paper: 'paper' }}
				fullScreen
				open={open.streamingModal}
				onClose={() => closeModal('streamingModal')}>
				<div className='selector-container streaming-selector'>
					<div className='exit-button' onClick={() => closeModal('streamingModal')}>
						<CloseIcon />
					</div>
					<div>
						<ToggleButtonGroup
							className='toggle-group'
							value={filters.streaming}
							onChange={selectedServicesOnChange as any}
							size='small'>
							{streamingServices.map(streamingService => (
								<ToggleButton
									disableRipple
									sx={{
										backgroundColor: 'transparent',
										border: 'none',
										'&.Mui-selected': {
											backgroundColor: 'transparent',
											'& .mobile-streaming-logo': {
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
										className='mobile-streaming-logo'
										alt={streamingService.name}
										src={streamingService.logo}
									/>
								</ToggleButton>
							))}
						</ToggleButtonGroup>
					</div>

					<button
						onClick={() => !isDisabled && closeModal('streamingModal')}
						className={`streaming-button-continue ${isDisabled && 'streaming-button-disabled'}`}>
						Continuar
					</button>
				</div>
			</Dialog>
		</div>
	);
};
