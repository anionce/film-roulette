import React, { ChangeEvent } from 'react';
import { APIMovieResponse, CountryResults, Movie } from '../../models/MovieResponse';
import { Loader } from '../../components/Loader/Loader';
import { MovieGenre } from '../../constants/genre';
import { MovieRuntime } from '../../constants/runtime';
import { GenreSelection } from '../../components/GenreSelection/GenreSelection';
import { RuntimeSelection } from '../../components/RuntimeSelection/RuntimeSelection';
import './Home.scss';
import { ExtraFilters } from '../../components/ExtraFilters/ExtraFilters';
import { PlayButton } from '../../components/PlayButton/PlayButton';
import { StreamingServices } from '../../constants/streamingServices';
import { MovieInfo } from '../../components/MovieInfo/MovieInfo';
import { NoResults } from '../../components/NoResults/NoResults';
import { HomeMobile } from '../../mobile-version/pages/HomeMobile/HomeMobile';
import { useMediaQuery } from 'react-responsive';
import {
	QueryDefinition,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';
import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { RandomMovieArgs } from '../../models/APIArgs';

export type FilterArguments = {
	genre: MovieGenre | null;
	duration: MovieRuntime | null;
	streaming: StreamingServices[] | null;
};

export type HomeProps = {
	triggerMovies: LazyQueryTrigger<
		QueryDefinition<
			RandomMovieArgs,
			BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
			'Movies',
			APIMovieResponse,
			'moviesApi'
		>
	>;
	setActualPage: React.Dispatch<React.SetStateAction<number>>;
	actualPage: number;
	movieResults: Movie[] | undefined;
	totalPages: number | undefined;
	setRandomMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
	currentMovie: any;
	shouldShowFewResults: boolean;
	isLoadingMovies: boolean;
	shouldShowNoResults: boolean;
	streamingData: CountryResults | undefined;
	dataIMDB: string | undefined;
	setFilters: any;
	onButtonClick: any;
	filters: any;
	randomMovieArray: any;
	shouldShowResult: any;
};

export const Home = ({
	randomMovieArray,
	isLoadingMovies,
	setActualPage,
	actualPage,
	totalPages,
	triggerMovies,
	movieResults,
	setRandomMovie,
	currentMovie,
	shouldShowFewResults,
	shouldShowNoResults,
	streamingData,
	dataIMDB,
	onButtonClick,
	setFilters,
	filters,
	shouldShowResult,
}: HomeProps) => {
	const isMobileVersion = useMediaQuery({ query: '(max-width: 600px)' });

	const onDurationChange = (event: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): void => {
		//const value = (event as ChangeEvent<HTMLInputElement>).target?.value ?? (event.target as HTMLElement).innerText;
		const value = event.currentTarget.getAttribute('data-value');
		setFilters((prev: FilterArguments) => ({ ...prev, duration: value as MovieRuntime }));
	};

	const onGenreChange = (event: ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>): void => {
		//const value = (event as ChangeEvent<HTMLInputElement>).target?.value ?? (event.target as HTMLElement).innerText;
		const value = event.currentTarget.getAttribute('data-value');
		setFilters((prev: FilterArguments) => ({ ...prev, genre: value as MovieGenre }));
	};

	const selectedServicesOnChange = (event: ChangeEvent<HTMLInputElement>, newServices: StreamingServices[]): void => {
		setFilters((prev: FilterArguments) => ({ ...prev, streaming: newServices }));
	};

	return (
		<>
			{isMobileVersion && (
				<HomeMobile
					onGenreChange={onGenreChange}
					onDurationChange={onDurationChange}
					selectedServicesOnChange={selectedServicesOnChange}
					filters={filters}
					actualPage={actualPage}
					setActualPage={setActualPage}
					totalPages={totalPages}
					triggerMovies={triggerMovies}
					movieResults={movieResults}
					setRandomMovie={setRandomMovie}
					shouldShowFewResults={shouldShowFewResults}
					onButtonClick={onButtonClick}
				/>
			)}
			<div data-testid='homeContainer' className='home-container'>
				<div data-testid='homeQuestions' className='home-questions-side'>
					<div className='home-questions-container'>
						<GenreSelection onGenreChange={onGenreChange} genre={filters.genre} />
						<RuntimeSelection onDurationChange={onDurationChange} duration={filters.duration} />
						<ExtraFilters
							triggerMovies={triggerMovies}
							setActualPage={setActualPage}
							selectedServicesOnChange={selectedServicesOnChange}
							filters={filters}
						/>

						<PlayButton
							filters={filters}
							actualPage={actualPage}
							setActualPage={setActualPage}
							totalPages={totalPages}
							triggerMovies={triggerMovies}
							movieResults={movieResults}
							setRandomMovie={setRandomMovie}
							shouldShowFewResults={shouldShowFewResults}
							onButtonClick={onButtonClick}
						/>
					</div>
				</div>
				<div data-testid='homeMovie' className='home-movie-side'>
					<div className='home-movie-container'>
						{isLoadingMovies && <Loader />}
						{shouldShowResult && (
							<MovieInfo
								currentMovie={currentMovie as Movie}
								streamingData={streamingData as CountryResults}
								dataIMDB={dataIMDB as string}
							/>
						)}
						{shouldShowNoResults && <NoResults />}
					</div>
				</div>
			</div>
		</>
	);
};
