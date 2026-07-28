import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { NotFound } from './pages/NotFound/NotFound';
import React, { useEffect, useRef, useState } from 'react';
import { MoviePage } from './pages/MoviePage/MoviePage';
import {
	useLazyGetDetailsQuery,
	useLazyGetMoviesQuery,
	useLazyGetRandomMoviesQuery,
	useLazyGetStreamingDetailsQuery,
} from './services/api';
import { CompleteMovie, CountryResults, Movie, MovieDetail } from './models/MovieResponse';
import { mapValueToGenre } from './constants/genre';
import { MovieRuntime, mapValueToMovieRuntime } from './constants/runtime';
import { mapValueToStreamingService } from './constants/streamingServices';
import { Home } from './pages/Home/Home';
import { FilterArguments } from './constants/filters';
import {
	MIN_RANDOM_PAGE,
	filterAvailableMovies,
	filterMovies,
	getRandomStartPage,
	getRandomValue,
	shuffleArray,
} from './helpers/AppHelper';
import { useLanguage } from './i18n/LanguageContext';

const MOVIES_BATCH_SIZE = 10;
const PAGE_WINDOW_SIZE = 4;

export const App = () => {
	const [filters, setFilters] = useState<FilterArguments>({
		genre: null,
		duration: null,
		streaming: null,
	});
	const [triggerMovies, { data: dataMovies, isLoading: isLoadingMovies, isError: isErrorMovies }] =
		useLazyGetMoviesQuery();
	const [triggerRandomMovies, { isLoading: isLoadingRandomMovies, isError: isErrorRandomMovies }] =
		useLazyGetRandomMoviesQuery();

	const { t, language } = useLanguage();
	const tmdbLanguage = language === 'en' ? 'en-US' : 'es-ES';
	const [triggerIMDBDetail] = useLazyGetDetailsQuery();
	const [triggerStreamingDetail] = useLazyGetStreamingDetailsQuery();
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [movieResultsArray, setMovieResultsArray] = useState<CompleteMovie[]>([]);
	const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(-1);
	const [shouldShowNoResults, setShouldShowNoResults] = useState<boolean>(false);
	const [noResultsMessage, setNoResultsMessage] = useState<string | undefined>(undefined);
	const [shouldUseRandomQuery, setShouldUseRandomQuery] = useState<boolean | undefined>(undefined);
	const nextPageCursorRef = useRef(1);

	useEffect(() => {
		if (!totalPages && dataMovies) {
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
	const shouldShowApiError: boolean = (isErrorMovies || isErrorRandomMovies) && !movieResultsArray.length;
	const shouldShowLoading: boolean =
		(isNotLoading || !dataMovies || !movieResultsArray.length) && !shouldShowNoResults && !shouldShowApiError;

	const getDetailsForMovies = async (currentPage: number, pagesToFetch: number) => {
		const movieDetails: CompleteMovie[] = [];

		if (shouldUseRandomQuery) {
			for (let page = currentPage; page <= pagesToFetch; page++) {
				const { data: dataRandomMovies } = await triggerRandomMovies({
					page,
					language: tmdbLanguage,
				});

				const movieDetailsPromises = dataRandomMovies?.results.slice(0, MOVIES_BATCH_SIZE).map(async (movie: Movie) => {
					const [detailData, streamingData] = await Promise.all([
						triggerIMDBDetail({ id: movie.id, language: tmdbLanguage }),
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
		} else {
			for (let page = currentPage; page <= pagesToFetch; page++) {
				const { data } = await triggerMovies({
					page,
					runtime: mapValueToMovieRuntime(filters.duration as MovieRuntime),
					genres: mapValueToGenre(filters.genre),
					streamingServices: mapValueToStreamingService(filters.streaming),
					language: tmdbLanguage,
				});

				const movieDetailsPromises = data?.results.slice(0, MOVIES_BATCH_SIZE).map(async (movie: Movie) => {
					const [detailData, streamingData] = await Promise.all([
						triggerIMDBDetail({ id: movie.id, language: tmdbLanguage }),
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

				const pageMovieDetails = await Promise.all(movieDetailsPromises as Promise<CompleteMovie>[]);
				movieDetails.push(...pageMovieDetails);
			}
		}

		return movieDetails;
	};

	const curateMovieData = async () => {
		if (shouldUseRandomQuery) {
			const randomValue = getRandomValue();
			const allRandomMovieDetails = await getDetailsForMovies(randomValue, randomValue);

			const shuffledDetails = shuffleArray(filterAvailableMovies(allRandomMovieDetails));

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

			const startPage = getRandomStartPage(total_pages);
			const endPage = Math.min(startPage + PAGE_WINDOW_SIZE - 1, total_pages);

			const movieDetails = await getDetailsForMovies(startPage, endPage);
			nextPageCursorRef.current =
				endPage >= total_pages ? Math.min(MIN_RANDOM_PAGE, total_pages) : endPage + 1;

			const shuffledDetails = shuffleArray(movieDetails);
			const totalFilteredMovies = filterMovies(shuffledDetails, filters);

			if (totalFilteredMovies.length) {
				setMovieResultsArray(totalFilteredMovies);
			} else {
				if ((filters.genre?.length ?? 0) > 1) {
					setNoResultsMessage(t.noResultsGenreComboMessage);
				}
				resetValues(true);
				return;
			}
		}
	};

	const fetchMoreFilteredMovies = async () => {
		if (!totalPages) {
			setCurrentMovieIndex(0);
			return;
		}

		const startPage = nextPageCursorRef.current;
		const endPage = Math.min(startPage + PAGE_WINDOW_SIZE - 1, totalPages);
		const additionalMovieDetails = await getDetailsForMovies(startPage, endPage);
		nextPageCursorRef.current = endPage >= totalPages ? Math.min(MIN_RANDOM_PAGE, totalPages) : endPage + 1;

		const newFilteredMovies = filterMovies(additionalMovieDetails, filters);

		if (newFilteredMovies.length) {
			const startIndex = movieResultsArray.length;
			setMovieResultsArray(prev => [...prev, ...shuffleArray(newFilteredMovies)]);
			setCurrentMovieIndex(startIndex);
		} else {
			setCurrentMovieIndex(0);
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
					genres: mapValueToGenre(filters.genre),
					streamingServices: mapValueToStreamingService(filters.streaming),
					language: tmdbLanguage,
				});
				setCurrentMovieIndex(prev => prev + 1);
			}
		} else if (movieResultsArray.length - 1 === currentMovieIndex) {
			if (shouldUseRandomQuery) {
				setMovieResultsArray([]);
				setCurrentMovieIndex(0);
				curateMovieData();
			} else {
				fetchMoreFilteredMovies();
			}
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
		nextPageCursorRef.current = 1;
		setShouldShowNoResults(noResults ?? false);
		if (!noResults) {
			setNoResultsMessage(undefined);
			setShouldUseRandomQuery(undefined);
		}
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
							shouldUseRandomQuery === undefined ? (
								<Navigate to='/' replace />
							) : (
								<MoviePage
									currentMovie={currentMovie}
									streamingData={currentMovie?.streamingData?.data}
									dataIMDB={currentMovie?.detailData?.data?.imdb_id as any}
									tagline={currentMovie?.detailData?.data?.tagline}
									onButtonAction={onButtonAction}
									onPreviousButtonClick={onPreviousButtonClick}
									resetValues={resetValues}
									currentMovieIndex={currentMovieIndex}
									shouldShowNoResults={shouldShowNoResults}
									noResultsMessage={noResultsMessage}
									isLoadingMovies={shouldShowLoading}
									shouldShowFewResults={shouldShowFewResults}
									shouldShowApiError={shouldShowApiError}
									onRetry={onButtonAction}
								/>
							)
						}
					/>
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</Router>
	);
};
