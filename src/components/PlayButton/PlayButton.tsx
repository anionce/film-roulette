import React from 'react';
import './PlayButton.scss';
import { mapValueToGenre } from '../../constants/genre';
import { mapValueToMovieRuntime } from '../../constants/runtime';
import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
	QueryDefinition,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';
import { APIMovieResponse, Movie } from '../../models/MovieResponse';
import { mapValueToStreamingService } from '../../constants/streamingServices';
import { FewResults } from '../FewResults/FewResults';
import { FilterArguments } from '../../pages/Home/Home';
import { RandomMovieArgs } from '../../models/APIArgs';

export type PlayButtonProps = {
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
	setRandomMovie: React.Dispatch<React.SetStateAction<Movie | undefined>>;
	getRandomMovie: (results: Movie[]) => Movie;
	filters: FilterArguments;
	toggleShowMovie: React.Dispatch<React.SetStateAction<boolean>>;
	toggleChangeMovie: React.Dispatch<React.SetStateAction<boolean>>;
	shouldShowFewResults: boolean;
};

export const PlayButton = ({
	setActualPage,
	actualPage,
	totalPages,
	filters,
	triggerMovies,
	movieResults,
	setRandomMovie,
	getRandomMovie,
	toggleShowMovie,
	toggleChangeMovie,
	shouldShowFewResults,
}: PlayButtonProps) => {
	const onButtonClick = () => {
		if (totalPages) {
			setActualPage(Math.floor(Math.random() * totalPages + 1));
		}

		if (filters.duration && filters.genre) {
			triggerMovies({
				page: actualPage,
				runtime: mapValueToMovieRuntime(filters.duration),
				genres: mapValueToGenre(filters.genre),
				streamingServices: mapValueToStreamingService(filters.streaming),
			});
		}
		if (movieResults) {
			setRandomMovie(getRandomMovie(movieResults));
		}

		toggleShowMovie(true);
		toggleChangeMovie(true);
	};

	return (
		<div className='button-container'>
			<button className='play-button' onClick={onButtonClick}>
				PLAY
			</button>
			{shouldShowFewResults && <FewResults />}
		</div>
	);
};
