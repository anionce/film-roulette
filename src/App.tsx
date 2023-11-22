import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { NotFound } from './pages/NotFound/NotFound';
import React, { useEffect, useState } from 'react';
import { MoviePage } from './new-version/pages/MoviePage/MoviePage';
import { useLazyGetDetailsQuery, useLazyGetRandomMovieQuery, useLazyGetStreamingDetailsQuery } from './services/api';
import { Movie } from './models/MovieResponse';
import { mapValueToGenre } from './constants/genre';
import { mapValueToMovieRuntime } from './constants/runtime';
import { mapValueToStreamingService } from './constants/streamingServices';
import { FilterArguments, Home } from './new-version/pages/Home/Home';

export const App = () => {
	const [filters, setFilters] = useState<FilterArguments>({
		genre: null,
		duration: null,
		streaming: null,
	});

	const [triggerMovies, { data: dataMovies, isLoading: isLoadingMovies }] = useLazyGetRandomMovieQuery();
	const [triggerIMDBDetail, { data: dataIMDB }] = useLazyGetDetailsQuery();
	const [triggerStreamingDetail, { data: streamingData }] = useLazyGetStreamingDetailsQuery();

	const [actualPage, setActualPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [movieResults, setMovieResults] = useState<Movie[] | undefined>(undefined);
	const [randomMovieArray, setRandomMovieArray] = useState<Movie[]>([]);
	const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(-1);

	const currentMovie = randomMovieArray[currentMovieIndex];
	const getRandomMovie = (results: Movie[]) => results[Math.floor(Math.random() * results.length)];

	const shouldShowFewResults: boolean = !!randomMovieArray.length && totalPages === 1;
	const shouldShowNoResults: boolean = !randomMovieArray.length && !currentMovie && totalPages === 0;
	const shouldShowLoading: boolean = isLoadingMovies || !dataMovies;

	useEffect(() => {
		if (dataMovies) {
			const { results, total_pages } = dataMovies;
			setTotalPages(total_pages);
			setMovieResults(results);
		}
		// eslint-disable-next-line
	}, [dataMovies]);

	useEffect(() => {
		if (movieResults?.length) {
			setRandomMovieArray(prev => [...prev, getRandomMovie(movieResults)]);
			setCurrentMovieIndex(prev => prev + 1);

			if (totalPages) {
				setActualPage(Math.floor(Math.random() * totalPages + 1));
			}
		}

		// eslint-disable-next-line
	}, [movieResults]);

	useEffect(() => {
		if (currentMovie) {
			triggerIMDBDetail({ id: currentMovie.id });
			triggerStreamingDetail({ id: currentMovie.id });
		}
		// eslint-disable-next-line
	}, [randomMovieArray]);

	const onButtonClick = () => {
		if (currentMovieIndex === randomMovieArray.length - 1) {
			if (filters.duration && filters.genre) {
				triggerMovies({
					page: actualPage,
					runtime: mapValueToMovieRuntime(filters.duration),
					genres: mapValueToGenre(filters.genre),
					streamingServices: mapValueToStreamingService(filters.streaming),
				});
			}
		} else {
			setCurrentMovieIndex(prev => prev + 1);
		}
	};

	const onPreviousButtonClick = () => {
		if (currentMovieIndex > 0) {
			setCurrentMovieIndex(currentMovieIndex - 1);
		}
	};

	const resetValues = () => {
		setFilters({
			genre: null,
			duration: null,
			streaming: null,
		});
		setRandomMovieArray([]);
		setActualPage(1);
		setTotalPages(undefined);
		setMovieResults(undefined);
		setCurrentMovieIndex(-1);
	};

	return (
		<Router>
			<Routes>
				<Route element={<MainLayout />}>
					<Route
						index
						element={<Home onButtonClick={onButtonClick} setFilters={setFilters} filters={filters} />}
					/>
					<Route
						path='/movie'
						element={
							<MoviePage
								currentMovie={currentMovie}
								streamingData={streamingData}
								dataIMDB={dataIMDB as string}
								onButtonClick={onButtonClick}
								onPreviousButtonClick={onPreviousButtonClick}
								resetValues={resetValues}
								currentMovieIndex={currentMovieIndex}
								shouldShowNoResults={shouldShowNoResults}
								isLoadingMovies={shouldShowLoading}
								shouldShowFewResults={shouldShowFewResults}
							/>
						}
					/>
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</Router>
	);
};
