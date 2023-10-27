import React, { useEffect, useState } from 'react';
import { CountryResults, Movie } from '../../models/MovieResponse';
import {
	useLazyGetDetailsQuery,
	useLazyGetRandomMovieQuery,
	useLazyGetStreamingDetailsQuery,
} from '../../services/api';
import { Loader } from '../../components/Loader/Loader';
import { MovieGenre, mapValueToGenre } from '../../constants/genre';
import { MovieRuntime, mapValueToMovieRuntime } from '../../constants/runtime';
import { GenreSelection } from '../../components/GenreSelection/GenreSelection';
import { RuntimeSelection } from '../../components/RuntimeSelection/RuntimeSelection';
import './Home.scss';
import { SelectChangeEvent } from '@mui/material';
import { ExtraFilters } from '../../components/ExtraFilters/ExtraFilters';
import { PlayButton } from '../../components/PlayButton/PlayButton';
import { StreamingServices, mapValueToStreamingService } from '../../constants/streamingServices';
import { MovieInfo } from '../../components/MovieInfo/MovieInfo';
import { NoResults } from '../../components/NoResults/NoResults';

export type FilterArguments = {
	genre: MovieGenre;
	duration: MovieRuntime;
	streaming: StreamingServices[] | null;
};

export const Home = () => {
	const [actualPage, setActualPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [movieResults, setMovieResults] = useState<Movie[] | undefined>(undefined);
	const [randomMovie, setRandomMovie] = useState<Movie | undefined>(undefined);

	const [showMovie, toggleShowMovie] = useState<boolean>(false);
	const [changeMovie, toggleChangeMovie] = useState<boolean>(false);

	const [filters, setFilters] = useState<FilterArguments>({
		genre: MovieGenre.Action,
		duration: MovieRuntime.Short,
		streaming: null,
	});

	const [triggerMovies, { data: dataMovies, isLoading: isLoadingMovies }] = useLazyGetRandomMovieQuery();
	const [triggerIMDBDetail, { data: dataIMDB }] = useLazyGetDetailsQuery();
	const [triggerStreamingDetail, { data: streamingData }] = useLazyGetStreamingDetailsQuery();

	const shouldShowMovieInfo: boolean = showMovie && !!randomMovie;
	const shouldShowFewResults: boolean = showMovie && changeMovie && totalPages === 1;
	const shouldShowNoResults: boolean = showMovie && changeMovie && !randomMovie && totalPages === 0;

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
		if (!shouldShowNoResults) {
			toggleShowMovie(false);
		}
		// eslint-disable-next-line
	}, [shouldShowNoResults]);

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

	const onDurationChange = (event: SelectChangeEvent<MovieRuntime>): void => {
		toggleChangeMovie(false);
		setActualPage(1);
		setFilters((prev: FilterArguments) => ({ ...prev, duration: event.target.value as MovieRuntime }));
	};

	const onGenreChange = (event: SelectChangeEvent<MovieGenre>): void => {
		toggleChangeMovie(false);
		setActualPage(1);
		setFilters((prev: FilterArguments) => ({ ...prev, genre: event.target.value as MovieGenre }));
	};

	const selectedServicesOnChange = (event: React.MouseEvent<HTMLElement>, newServices: StreamingServices[]): void => {
		toggleChangeMovie(false);
		setActualPage(1);
		setFilters((prev: FilterArguments) => ({ ...prev, streaming: newServices }));
	};

	return (
		<div data-testid='homeContainer' className='home-container'>
			<div data-testid='homeQuestions' className='home-questions-side'>
				<div className='home-questions-container'>
					<GenreSelection onMainGenreChange={onGenreChange} genre={filters.genre} />
					<RuntimeSelection onDurationChange={onDurationChange} duration={filters.duration} />
					<ExtraFilters
						triggerMovies={triggerMovies}
						setActualPage={setActualPage}
						selectedServicesOnChange={selectedServicesOnChange}
						filters={filters}
					/>

					<PlayButton
						toggleShowMovie={toggleShowMovie}
						toggleChangeMovie={toggleChangeMovie}
						filters={filters}
						actualPage={actualPage}
						setActualPage={setActualPage}
						totalPages={totalPages}
						triggerMovies={triggerMovies}
						movieResults={movieResults}
						setRandomMovie={setRandomMovie}
						getRandomMovie={getRandomMovie}
						shouldShowFewResults={shouldShowFewResults}
					/>
				</div>
			</div>
			<div data-testid='homeMovie' className='home-movie-side'>
				<div className='home-movie-container'>
					{isLoadingMovies && <Loader />}
					{shouldShowMovieInfo && (
						<MovieInfo
							randomMovie={randomMovie as Movie}
							streamingData={streamingData as CountryResults}
							dataIMDB={dataIMDB as string}
						/>
					)}
					{shouldShowNoResults && <NoResults />}
				</div>
			</div>
		</div>
	);
};
