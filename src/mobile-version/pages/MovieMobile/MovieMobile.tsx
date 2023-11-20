import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Streaming } from '../../../components/Streaming/Streaming';
import { Movie, AvailabilityInfo, CountryResults } from '../../../models/MovieResponse';
import './MovieMobile.scss';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../../constants/movie';
import { RoundedStar, Rating as Stars } from '@smastrom/react-rating';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useNavigate } from 'react-router-dom';
import { NoResults } from '../../../components/NoResults/NoResults';
import { Loader } from '../../../components/Loader/Loader';

export type MovieMobileInfoProps = {
	currentMovie: Movie;
	streamingData: CountryResults | undefined;
	dataIMDB: string;
	onButtonClick: any;
	onPreviousButtonClick: any;
	resetValues: any;
	currentMovieIndex: any;
	shouldShowNoResults: any;
	isLoadingMovies: boolean;
};

export const MovieMobile = ({
	currentMovie,
	isLoadingMovies,
	streamingData,
	dataIMDB,
	onButtonClick,
	onPreviousButtonClick,
	resetValues,
	currentMovieIndex,
	shouldShowNoResults,
}: MovieMobileInfoProps) => {
	const navigate = useNavigate();

	const getTruncatedPlot = () => {
		const trimmedString = currentMovie.overview.substring(0, 225);

		const result = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

		return `${result}... `;
	};

	const myStyles = {
		itemShapes: RoundedStar,
		activeFillColor: '#03193a',
		inactiveFillColor: '#a1c2f3',
		inactiveStrokeColor: 'white',
		activeStrokeColor: 'white',
		itemStrokeWidth: 0.5,
	};

	const ratingSize = 130;

	const cleanRating = Number((currentMovie?.vote_average / 2).toFixed(2));

	const isDisabled = currentMovieIndex === 0;

	const goToHome = () => {
		navigate('/');
		resetValues();
	};

	return (
		<div className='mobile-page-container'>
			{isLoadingMovies && <Loader />}
			<div className='exit-button-container' onClick={goToHome}>
				<div className='exit-button-movie-page'>
					<CloseIcon />
				</div>
			</div>
			{shouldShowNoResults && <NoResults />}
			{currentMovie && (
				<div className='mobile-movie-info-container'>
					<div className='poster-button-container'>
						<div onClick={onPreviousButtonClick} className={`${isDisabled && 'button-disabled'}`}>
							<SkipPreviousIcon />
						</div>
						<div className='poster-container'>
							<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
								<img
									className='mobile-poster-img'
									alt={currentMovie?.title}
									src={`${MOVIE_POSTER_PATH}${currentMovie?.poster_path}`}
								/>
							</a>
						</div>

						<div onClick={onButtonClick} className='skip-next-button'>
							<SkipNextIcon />
						</div>
					</div>

					<div className='plot-container'>
						<div className='plot-box'>
							<p className='plot-text'>
								{getTruncatedPlot()}
								<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
									+
								</a>
							</p>
						</div>
					</div>
					<div className='rating-container'>
						<Stars
							readOnly={true}
							style={{ maxWidth: ratingSize }}
							value={cleanRating}
							itemStyles={myStyles}
						/>
					</div>

					<Streaming
						//shouldShowStreamingData={shouldShowStreamingData}
						justWatchLink={streamingData?.link as string}
						streamingInfo={streamingData?.flatrate as AvailabilityInfo[]}
					/>
				</div>
			)}
		</div>
	);
};
