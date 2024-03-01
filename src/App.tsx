import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { NotFound } from './pages/NotFound/NotFound';
import React, { useEffect, useState } from 'react';
import { MoviePage } from './pages/MoviePage/MoviePage';
import {
	useLazyGetDetailsQuery,
	useLazyGetMoviesQuery,
	useLazyGetRandomMoviesQuery,
	useLazyGetStreamingDetailsQuery,
} from './services/api';
import { APIMovieResponse, CompleteMovie, CountryResults, Movie, MovieDetail } from './models/MovieResponse';
import { MovieGenre, mapValueToGenre } from './constants/genre';
import { MovieRuntime, mapValueToMovieRuntime } from './constants/runtime';
import { mapValueToStreamingService } from './constants/streamingServices';
import { Home } from './pages/Home/Home';
import { FilterArguments } from './constants/filters';
import { filterMovies, getRandomValue, shuffleArray } from './helpers/AppHelper';

export const App = () => {
	const [filters, setFilters] = useState<FilterArguments>({
		genre: null,
		duration: null,
		streaming: null,
	});
	const [triggerMovies, { data: dataMovies, isLoading: isLoadingMovies }] = useLazyGetMoviesQuery();
	const [triggerRandomMovies, { isLoading: isLoadingRandomMovies }] = useLazyGetRandomMoviesQuery();

	const [triggerIMDBDetail] = useLazyGetDetailsQuery();
	const [triggerStreamingDetail] = useLazyGetStreamingDetailsQuery();
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [movieResultsArray, setMovieResultsArray] = useState<CompleteMovie[]>([]);
	const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(-1);
	const [shouldShowNoResults, setShouldShowNoResults] = useState<boolean>(false);
	const [shouldUseRandomQuery, setShouldUseRandomQuery] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		if (!totalPages && dataMovies) {
			console.log('USEFFECT dataMovies', dataMovies);
			curateMovieData();
		}
		// eslint-disable-next-line
	}, [dataMovies]);

	useEffect(() => {
		if (shouldUseRandomQuery !== undefined) {
			onButtonAction();
		} // eslint-disable-next-line
	}, [shouldUseRandomQuery]);

	let currentMovie: CompleteMovie | undefined = movieResultsArray[currentMovieIndex];

	const isNotLoading: boolean = !isLoadingMovies && !isLoadingRandomMovies;
	const shouldShowFewResults: boolean = !!movieResultsArray.length && totalPages === 1;
	const shouldShowLoading: boolean =
		(isNotLoading || !dataMovies || !movieResultsArray.length) && !shouldShowNoResults;

	const getDetailsForMovies = async (
		currentPage: number,
		pagesToFetch: number,
		initialData?: APIMovieResponse | undefined
	) => {
		const movieDetails: CompleteMovie[] = [];

		if (shouldUseRandomQuery) {
			for (let page = currentPage; page <= pagesToFetch; page++) {
				const { data: dataRandomMovies } = await triggerRandomMovies({
					page,
				});

				const movieDetailsPromises = dataRandomMovies?.results.map(async (movie: Movie) => {
					const [detailData, streamingData] = await Promise.all([
						triggerIMDBDetail({ id: movie.id }),
						triggerStreamingDetail({ id: movie.id }),
					]);

					const detailDataResult = detailData as { data?: MovieDetail };
					const streamingDataResult = streamingData as { data?: CountryResults };

					return {
						...movie,
						detailData: detailDataResult,
						streamingData: streamingDataResult,
					};
				});

				const randomMovieDetailsPromise = await Promise.all(movieDetailsPromises as Promise<CompleteMovie>[]);
				movieDetails.push(...randomMovieDetailsPromise);
			}
		} else if (initialData) {
			const movieDetailsPromises = initialData?.results.map(async (movie: Movie) => {
				const [detailData, streamingData] = await Promise.all([
					triggerIMDBDetail({ id: movie.id }),
					triggerStreamingDetail({ id: movie.id }),
				]);

				const detailDataResult = detailData as { data?: MovieDetail };
				const streamingDataResult = streamingData as { data?: CountryResults };

				return {
					...movie,
					detailData: detailDataResult,
					streamingData: streamingDataResult,
				};
			});

			const movieDetailsPromise = await Promise.all(movieDetailsPromises as Promise<CompleteMovie>[]);
			movieDetails.push(...movieDetailsPromise);
		} else {
			for (let page = currentPage; page <= pagesToFetch; page++) {
				const { data } = await triggerMovies({
					page,
					runtime: mapValueToMovieRuntime(filters.duration as MovieRuntime),
					genres: mapValueToGenre(filters.genre as MovieGenre),
					streamingServices: mapValueToStreamingService(filters.streaming),
				});

				const movieDetailsPromises = data?.results.map(async (movie: Movie) => {
					const [detailData, streamingData] = await Promise.all([
						triggerIMDBDetail({ id: movie.id }),
						triggerStreamingDetail({ id: movie.id }),
					]);

					const detailDataResult = detailData as { data?: MovieDetail };
					const streamingDataResult = streamingData as { data?: CountryResults };

					return {
						...movie,
						detailData: detailDataResult,
						streamingData: streamingDataResult,
					};
				});

				const movieDetails = await Promise.all(movieDetailsPromises as Promise<CompleteMovie>[]);
				movieDetails.push(...movieDetails);
			}
		}

		return movieDetails;
	};

	const curateMovieData = async () => {
		if (shouldUseRandomQuery) {
			const randomValue = getRandomValue();
			const allRandomMovieDetails = await getDetailsForMovies(randomValue, randomValue + 2);

			const shuffledDetails = shuffleArray(allRandomMovieDetails);

			if (shuffledDetails.length) {
				setMovieResultsArray(shuffledDetails);
			} else {
				resetValues(true);
				return;
			}
		}

		if (dataMovies && !shouldUseRandomQuery) {
			const { total_pages } = dataMovies;
			setTotalPages(total_pages);
			let totalFilteredMovies = [];

			const pagesToFetch = Math.min(2, total_pages);
			const initialMovieDetails = await getDetailsForMovies(1, pagesToFetch, dataMovies);

			const shuffledDetails = shuffleArray(initialMovieDetails);
			totalFilteredMovies = filterMovies(shuffledDetails, filters);

			if (total_pages > 2) {
				const maxPage = Math.min(total_pages, 4);
				const additionalMovieDetails = await getDetailsForMovies(1, maxPage);

				const allShuffledDetails = shuffleArray([...initialMovieDetails, ...additionalMovieDetails]);
				totalFilteredMovies = filterMovies(allShuffledDetails, filters);
			}

			if (totalFilteredMovies.length) {
				setMovieResultsArray(totalFilteredMovies);
			} else {
				resetValues(true);
				return;
			}
		}
	};

	const onButtonClick = (shouldRandomize: boolean) => {
		if (shouldRandomize) {
			setShouldUseRandomQuery(true);
		} else {
			setShouldUseRandomQuery(false);
		}
	};

	const onButtonAction = () => {
		if (!movieResultsArray.length) {
			if (shouldUseRandomQuery) {
				curateMovieData();
				setCurrentMovieIndex(prev => prev + 1);
			} else {
				triggerMovies({
					page: 1,
					runtime: mapValueToMovieRuntime(filters.duration as MovieRuntime),
					genres: mapValueToGenre(filters.genre as MovieGenre),
					streamingServices: mapValueToStreamingService(filters.streaming),
				});
				setCurrentMovieIndex(prev => prev + 1);
			}
		} else if (movieResultsArray.length - 1 === currentMovieIndex) {
			setCurrentMovieIndex(0);
		} else if (movieResultsArray.length) {
			setCurrentMovieIndex(prev => prev + 1);
		}
	};

	const onPreviousButtonClick = () => {
		if (currentMovieIndex > 0) {
			setCurrentMovieIndex(currentMovieIndex - 1);
		}
	};

	const resetValues = (noResults?: boolean) => {
		setFilters({
			genre: null,
			duration: null,
			streaming: null,
		});
		setMovieResultsArray([]);
		setTotalPages(undefined);
		setCurrentMovieIndex(-1);
		setShouldShowNoResults(noResults ?? false);
		setShouldUseRandomQuery(undefined);
	};

	console.log(
		'totalpages',
		totalPages,
		'shouldUseRandomQuery',
		shouldUseRandomQuery,
		'shouldShowNoResults',
		shouldShowNoResults
	);

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
								streamingData={currentMovie?.streamingData?.data}
								dataIMDB={currentMovie?.detailData?.data?.imdb_id as any}
								onButtonAction={onButtonAction}
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
