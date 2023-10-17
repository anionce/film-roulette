import React, { useEffect, useState } from 'react';
import { AvailabilityInfo, CountryResults, Movie } from '../../models/MovieResponse';
import {
	useLazyGetDetailsQuery,
	useLazyGetRandomMovieQuery,
	useLazyGetStreamingDetailsQuery,
} from '../../services/api';
import { Loader } from '../../components/Loader/Loader';
import { Poster } from '../../components/Poster/Poster';
import { MovieGenre, mapValueToGenre } from '../../constants/genre';
import { MovieRuntime, mapValueToMovieRuntime } from '../../constants/runtime';
import { GenreSelection } from '../../components/GenreSelection/GenreSelection';
import { RuntimeSelection } from '../../components/RuntimeSelection/RuntimeSelection';
import './Home.scss';
import { Plot } from '../../components/Plot/Plot';
import { Rating } from '../../components/Rating/Rating';
import { SelectChangeEvent } from '@mui/material';
import { Streaming } from '../../components/Streaming/Streaming';

export const Home = () => {
	const [genre, setGenre] = useState<MovieGenre>(MovieGenre.Action);
	const [duration, setDuration] = useState<MovieRuntime>(MovieRuntime.Short);

	const [actualPage, setActualPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [movieResults, setMovieResults] = useState<Movie[] | undefined>(undefined);
	const [randomMovie, setRandomMovie] = useState<Movie | undefined>(undefined);

	const [triggerMovies, { data: dataMovies, isLoading: isLoadingMovies }] = useLazyGetRandomMovieQuery();
	const [triggerIMDBDetail, { data: dataIMDB }] = useLazyGetDetailsQuery();
	const [triggerStreamingDetail, { data: streamingData }] = useLazyGetStreamingDetailsQuery();

	const shouldShowPoster: boolean = !!randomMovie;
	const shouldShowPlot: boolean = !!randomMovie?.overview;
	const shouldShowRating: boolean = !!randomMovie?.vote_average;
	const shouldShowStreamingData: boolean = !!streamingData?.flatrate;

	const getRandomMovie = (results: Movie[]) => results[Math.floor(Math.random() * results.length)];

	useEffect(() => {
		if (dataMovies) {
			const { results, total_pages } = dataMovies;
			setTotalPages(total_pages);
			setMovieResults(results);
		}

		// eslint-disable-next-line
	}, [dataMovies]);

	useEffect(() => {
		if (movieResults && !randomMovie) {
			setRandomMovie(getRandomMovie(movieResults));
		}
		// eslint-disable-next-line
	}, [movieResults]);

	useEffect(() => {
		if (randomMovie) {
			triggerIMDBDetail({ id: randomMovie.id });
			triggerStreamingDetail({ id: randomMovie.id });
		}
		// eslint-disable-next-line
	}, [randomMovie]);

	const onButtonClick = () => {
		if (totalPages) {
			setActualPage(Math.floor(Math.random() * totalPages + 1));
		}
		if (duration && genre) {
			triggerMovies({
				page: actualPage,
				runtime: mapValueToMovieRuntime(duration),
				genres: mapValueToGenre(genre),
			});
		}
		if (movieResults) {
			setRandomMovie(getRandomMovie(movieResults));
		}
	};

	const onDurationChange = (event: SelectChangeEvent<MovieRuntime>): void => {
		setActualPage(1);
		setDuration(event.target.value as MovieRuntime);
	};

	const onGenreChange = (event: SelectChangeEvent<MovieGenre>): void => {
		setActualPage(1);
		setGenre(event.target.value as MovieGenre);
	};

	return (
		<div data-testid='homeContainer' className='home-container'>
			<div data-testid='homeQuestions' className='home-questions-side'>
				<div className='home-questions-container'>
					<GenreSelection onMainGenreChange={onGenreChange} genre={genre} />
					<RuntimeSelection onDurationChange={onDurationChange} duration={duration} />
					<button className='play-button' onClick={onButtonClick}>
						PLAY
					</button>
				</div>
			</div>
			<div data-testid='homeMovie' className='home-movie-side'>
				<div className='home-movie-container'>
					{isLoadingMovies && <Loader />}
					{shouldShowPoster && <Poster dataIMDB={dataIMDB as string} randomMovie={randomMovie as Movie} />}
					<div className='additional-info'>
						{shouldShowPlot && (
							<Plot plot={(randomMovie as Movie)?.overview} dataIMDB={dataIMDB as string} />
						)}
						{shouldShowRating && <Rating rating={(randomMovie as Movie)?.vote_average} />}
						{shouldShowStreamingData && (
							<Streaming
								justWatchLink={(streamingData as CountryResults).link}
								streamingInfo={(streamingData as CountryResults).flatrate as AvailabilityInfo[]}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
