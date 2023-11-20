import React from 'react';
import './PlayButton.scss';
import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
	QueryDefinition,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';
import { APIMovieResponse, Movie } from '../../models/MovieResponse';
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
	setRandomMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
	filters: FilterArguments;

	shouldShowFewResults: boolean;
	onButtonClick: any;
};

export const PlayButton = ({
	setActualPage,
	actualPage,
	totalPages,
	filters,
	triggerMovies,
	movieResults,
	setRandomMovie,

	shouldShowFewResults,
	onButtonClick,
}: PlayButtonProps) => {
	return (
		<div className='button-container'>
			<button className='play-button' onClick={onButtonClick}>
				PLAY
			</button>
			{shouldShowFewResults && <FewResults />}
		</div>
	);
};
