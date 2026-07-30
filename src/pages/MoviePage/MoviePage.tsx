import React from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import { Movie, CountryResults } from '../../models/MovieResponse';
import './MoviePage.scss';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { NoResults } from '../../components/NoResults/NoResults';
import { Streaming } from '../../components/Streaming/Streaming';
import { MoviePoster } from '../../components/MoviePoster/MoviePoster';
import { MoviePlot } from '../../components/MoviePlot/MoviePlot';
import { FewResults } from '../../components/FewResults/FewResults';
import { ApiError } from '../../components/ApiError/ApiError';
import { useLanguage } from '../../i18n/LanguageContext';

export type MoviePageProps = {
	currentMovie: Movie;
	streamingData: CountryResults | undefined;
	dataIMDB: string;
	tagline?: string;
	onButtonAction: () => void;
	onPreviousButtonClick: () => void;
	resetValues: () => void;
	currentMovieIndex: number;
	shouldShowNoResults: boolean;
	noResultsMessage?: string;
	isLoadingMovies: boolean;
	isFetchingMore: boolean;
	hasNextMovie: boolean;
	shouldShowFewResults: boolean;
	fewResultsCount: number;
	shouldShowApiError: boolean;
	onRetry: () => void;
};

export const MoviePage = ({
	currentMovie,
	isLoadingMovies,
	isFetchingMore,
	hasNextMovie,
	streamingData,
	dataIMDB,
	tagline,
	onButtonAction,
	onPreviousButtonClick,
	resetValues,
	currentMovieIndex,
	shouldShowNoResults,
	noResultsMessage,
	shouldShowFewResults,
	fewResultsCount,
	shouldShowApiError,
	onRetry,
}: MoviePageProps) => {
	const navigate = useNavigate();
	const { t } = useLanguage();

	const isDisabled = currentMovieIndex === 0;

	const goToHome = () => {
		navigate('/');
		resetValues();
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			goToHome();
		}
	};

	return (
		<div className='movie-page-container'>
			<div className='exit-button-container'>
				<div
					className='exit-button-movie-page'
					onClick={goToHome}
					onKeyDown={handleKeyPress}
					role='button'
					tabIndex={0}
					aria-label={t.exitAriaLabel}>
					<UndoIcon />
				</div>
			</div>
			{shouldShowApiError && <ApiError onRetry={onRetry} />}
			{!shouldShowApiError && isLoadingMovies && !currentMovie && <Loader />}
			{!shouldShowApiError && shouldShowNoResults && <NoResults message={noResultsMessage} onGoHome={goToHome} />}
			{!shouldShowApiError && !shouldShowNoResults && currentMovie && (
				<div className='movie-info-container'>
					<div className='movie-visual'>
						<MoviePoster
							isDisabled={isDisabled}
							isNextDisabled={isFetchingMore}
							hasNext={hasNextMovie}
							dataIMDB={dataIMDB}
							onButtonAction={onButtonAction}
							onPreviousButtonClick={onPreviousButtonClick}
							onEscButtonClick={goToHome}
							currentMovie={currentMovie}
						/>
					</div>
					<div className='movie-meta'>
						<div className='movie-heading'>
							<p className='movie-title'>{currentMovie.title}</p>
							{!!tagline && <p className='movie-tagline'>{tagline}</p>}
						</div>
						<MoviePlot currentMovie={currentMovie} dataIMDB={dataIMDB} />
						{!!(streamingData?.flatrate?.length || streamingData?.free?.length || streamingData?.ads?.length) && (
							<div className='movie-streaming'>
								<p className='movie-streaming-label'>{t.availableOnLabel}</p>
								<Streaming streamingData={streamingData} />
							</div>
						)}
					</div>
				</div>
			)}
			{!shouldShowNoResults && shouldShowFewResults && <FewResults count={fewResultsCount} />}
		</div>
	);
};
