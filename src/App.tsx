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
import { mapValueToMovieRuntime } from './constants/runtime';
import { mapValueToStreamingService } from './constants/streamingServices';
import { MovieEra, mapValueToEraRange } from './constants/era';
import { Home } from './pages/Home/Home';
import { FilterArguments } from './constants/filters';
import {
	filterAvailableMovies,
	filterMovies,
	getSearchStartPage,
	getRandomValue,
	shuffleArray,
} from './helpers/AppHelper';
import { useLanguage } from './i18n/LanguageContext';

// TMDB returns 20 results per discover page; checking only a slice of that wastes half of
// each page we already paid the request for, and shrinks results for niche filter combos.
const MOVIES_BATCH_SIZE = 20;
const PAGE_WINDOW_SIZE = 4;
const MIN_RESULTS_TARGET = 100;
const MAX_FETCH_WINDOWS = 6;
export const FEW_RESULTS_THRESHOLD = 30;

export const App = () => {
	const [filters, setFilters] = useState<FilterArguments>({
		genre: null,
		duration: null,
		streaming: null,
		era: null,
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
	const remainingPagesRef = useRef(0);
	const isFetchingMoreRef = useRef(false);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [isCatalogExhausted, setIsCatalogExhausted] = useState(false);

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
	const shouldShowFewResults: boolean =
		!!movieResultsArray.length &&
		!shouldUseRandomQuery &&
		isCatalogExhausted &&
		movieResultsArray.length < FEW_RESULTS_THRESHOLD;
	const hasNextMovie: boolean =
		shouldUseRandomQuery === true || !isCatalogExhausted || currentMovieIndex < movieResultsArray.length - 1;
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
			const eraRange = mapValueToEraRange(filters.era as MovieEra);

			for (let page = currentPage; page <= pagesToFetch; page++) {
				const { data } = await triggerMovies({
					page,
					runtime: mapValueToMovieRuntime(filters.duration),
					genres: mapValueToGenre(filters.genre),
					streamingServices: mapValueToStreamingService(filters.streaming),
					language: tmdbLanguage,
					releaseDateGte: eraRange?.gte,
					releaseDateLte: eraRange?.lte,
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
			if (isFetchingMoreRef.current) {
				return;
			}
			isFetchingMoreRef.current = true;
			setIsFetchingMore(true);

			try {
				const randomValue = getRandomValue();
				const allRandomMovieDetails = await getDetailsForMovies(randomValue, randomValue);

				const shuffledDetails = shuffleArray(filterAvailableMovies(allRandomMovieDetails));

				if (shuffledDetails.length) {
					setMovieResultsArray(shuffledDetails);
				} else {
					resetValues(true);
					return;
				}
			} finally {
				isFetchingMoreRef.current = false;
				setIsFetchingMore(false);
			}
		}

		if (dataMovies && !shouldUseRandomQuery) {
			const { total_pages } = dataMovies;
			setTotalPages(total_pages);

			let cursor = getSearchStartPage(total_pages);
			let remaining = total_pages;
			let allMovieDetails: CompleteMovie[] = [];
			let totalFilteredMovies: CompleteMovie[] = [];
			let windowsFetched = 0;

			while (totalFilteredMovies.length < MIN_RESULTS_TARGET && windowsFetched < MAX_FETCH_WINDOWS && remaining > 0) {
				const pagesThisWindow = Math.min(PAGE_WINDOW_SIZE, remaining);
				const endPage = Math.min(cursor + pagesThisWindow - 1, total_pages);
				const windowDetails = await getDetailsForMovies(cursor, endPage);

				allMovieDetails = [...allMovieDetails, ...windowDetails];
				totalFilteredMovies = filterMovies(shuffleArray(allMovieDetails), filters);

				const fetchedNow = endPage - cursor + 1;
				remaining -= fetchedNow;
				cursor = endPage >= total_pages && remaining > 0 ? 1 : endPage + 1;
				windowsFetched += 1;
			}

			nextPageCursorRef.current = cursor;
			remainingPagesRef.current = remaining;
			setIsCatalogExhausted(remaining <= 0);

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
		if (isFetchingMoreRef.current) {
			return;
		}
		isFetchingMoreRef.current = true;
		setIsFetchingMore(true);

		try {
			if (!totalPages || remainingPagesRef.current <= 0) {
				setCurrentMovieIndex(0);
				return;
			}

			const cursor = nextPageCursorRef.current;
			const pagesThisWindow = Math.min(PAGE_WINDOW_SIZE, remainingPagesRef.current);
			const endPage = Math.min(cursor + pagesThisWindow - 1, totalPages);
			const additionalMovieDetails = await getDetailsForMovies(cursor, endPage);

			const fetchedNow = endPage - cursor + 1;
			const remaining = remainingPagesRef.current - fetchedNow;
			nextPageCursorRef.current = endPage >= totalPages && remaining > 0 ? 1 : endPage + 1;
			remainingPagesRef.current = remaining;
			setIsCatalogExhausted(remaining <= 0);

			const newFilteredMovies = filterMovies(additionalMovieDetails, filters);

			if (newFilteredMovies.length) {
				const startIndex = movieResultsArray.length;
				setMovieResultsArray(prev => [...prev, ...shuffleArray(newFilteredMovies)]);
				setCurrentMovieIndex(startIndex);
			} else {
				setCurrentMovieIndex(0);
			}
		} finally {
			isFetchingMoreRef.current = false;
			setIsFetchingMore(false);
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
				const eraRange = mapValueToEraRange(filters.era as MovieEra);

				triggerMovies({
					page: 1,
					runtime: mapValueToMovieRuntime(filters.duration),
					genres: mapValueToGenre(filters.genre),
					streamingServices: mapValueToStreamingService(filters.streaming),
					language: tmdbLanguage,
					releaseDateGte: eraRange?.gte,
					releaseDateLte: eraRange?.lte,
				});
				setCurrentMovieIndex(prev => prev + 1);
			}
		} else if (movieResultsArray.length - 1 === currentMovieIndex) {
			if (shouldUseRandomQuery) {
				setMovieResultsArray([]);
				setCurrentMovieIndex(0);
				curateMovieData();
			} else if (!isCatalogExhausted) {
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
		setMovieResultsArray([]);
		setTotalPages(undefined);
		setCurrentMovieIndex(-1);
		nextPageCursorRef.current = 1;
		remainingPagesRef.current = 0;
		isFetchingMoreRef.current = false;
		setIsFetchingMore(false);
		setIsCatalogExhausted(false);
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
									isFetchingMore={isFetchingMore}
									hasNextMovie={hasNextMovie}
									shouldShowFewResults={shouldShowFewResults}
									fewResultsCount={movieResultsArray.length}
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
