import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { NotFound } from './pages/NotFound/NotFound';
import React, { useEffect, useState } from 'react';
import { MoviePage } from './pages/MoviePage/MoviePage';
import { useLazyGetDetailsQuery, useLazyGetMoviesQuery, useLazyGetStreamingDetailsQuery } from './services/api';
import { AvailabilityInfo, CompleteMovie, CountryResults, Movie, MovieDetail } from './models/MovieResponse';
import { MovieGenre, mapValueToGenre } from './constants/genre';
import { MovieRuntime, mapValueToMovieRuntime } from './constants/runtime';
import { mapValueToStreamingService } from './constants/streamingServices';
import { Home } from './pages/Home/Home';
import { FilterArguments } from './constants/filters';

export const App = () => {
	const [filters, setFilters] = useState<FilterArguments>({
		genre: null,
		duration: null,
		streaming: null,
	});
	const [triggerMovies, { data: dataMovies, isLoading: isLoadingMovies }] = useLazyGetMoviesQuery();
	const [triggerIMDBDetail] = useLazyGetDetailsQuery();
	const [triggerStreamingDetail] = useLazyGetStreamingDetailsQuery();
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [randomMovieArray, setRandomMovieArray] = useState<CompleteMovie[]>([]);
	const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(-1);
	const [shouldShowNoResults, setShouldShowNoResults] = useState<boolean>(false);

	const currentMovie: CompleteMovie = randomMovieArray[currentMovieIndex];

	const shouldShowFewResults: boolean = !!randomMovieArray.length && totalPages === 1;
	const shouldShowLoading: boolean =
		(isLoadingMovies || !dataMovies || !randomMovieArray.length) && !shouldShowNoResults;

	const shuffleArray = (array: CompleteMovie[]) => {
		return [...array].sort(() => Math.random() - 0.5);
	};

	useEffect(() => {
		if (dataMovies && !totalPages) {
			const { total_pages } = dataMovies;
			setTotalPages(total_pages);

			const fetchDataForMovies = async () => {
				const allMovieDetails: CompleteMovie[] = [];

				const pagesToFetch = Math.min(2, total_pages);
				for (let page = 1; page <= pagesToFetch; page++) {
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
					allMovieDetails.push(...movieDetails);
				}

				const shuffledDetails = shuffleArray(allMovieDetails);

				const filteredResults = shuffledDetails.filter(movie => {
					if (!filters.streaming) {
						return true;
					}

					const flatratePlatforms =
						movie.streamingData?.data?.flatrate?.map(
							(platform: AvailabilityInfo) => platform.provider_name
						) ?? [];

					return filters.streaming.some(streamingPlatform => flatratePlatforms.includes(streamingPlatform));
				});

				if (filteredResults.length) {
					console.log(filteredResults, 'filtered');
					setRandomMovieArray(filteredResults);
				} else {
					setShouldShowNoResults(true);
					return;
				}

				if (total_pages > 2) {
					console.log('entro aqui');
					const maxPage = Math.min(total_pages, 10);
					for (let page = 3; page <= maxPage; page++) {
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
						allMovieDetails.push(...movieDetails);
					}

					const allShuffledDetails = shuffleArray(allMovieDetails);

					// Filter results for all pages
					const filteredResultsAllPages = allShuffledDetails.filter(movie => {
						if (!filters.streaming) {
							return true;
						}

						const flatratePlatforms =
							movie.streamingData?.data?.flatrate?.map(
								(platform: AvailabilityInfo) => platform.provider_name
							) ?? [];

						return filters.streaming.some(streamingPlatform =>
							flatratePlatforms.includes(streamingPlatform)
						);
					});

					setRandomMovieArray(prev => [...prev, ...filteredResultsAllPages]);
				}
			};

			fetchDataForMovies();
		}
		// eslint-disable-next-line
	}, [dataMovies]);

	const onButtonClick = () => {
		if (!randomMovieArray.length) {
			setShouldShowNoResults(false);
			setCurrentMovieIndex(prev => prev + 1);
			if (filters.duration && filters.genre) {
				triggerMovies({
					page: 1,
					runtime: mapValueToMovieRuntime(filters.duration),
					genres: mapValueToGenre(filters.genre),
					streamingServices: mapValueToStreamingService(filters.streaming),
				});
			}
		} else if (randomMovieArray.length - 1 === currentMovieIndex) {
			setCurrentMovieIndex(0);
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
		setTotalPages(undefined);
		setCurrentMovieIndex(-1);
		setShouldShowNoResults(false);
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
								streamingData={currentMovie?.streamingData?.data}
								dataIMDB={currentMovie?.detailData?.data?.imdb_id as any}
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
