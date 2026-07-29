import React, { useEffect, useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useSwipeable } from 'react-swipeable';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import { MovieRating } from '../MovieRating/MovieRating';
import './MoviePoster.scss';

export type MoviePosterProps = {
	currentMovie: Movie;
	dataIMDB: string;
	onButtonAction: () => void;
	onPreviousButtonClick: () => void;
	onEscButtonClick: () => void;
	isDisabled: boolean;
	isNextDisabled?: boolean;
	hasNext?: boolean;
};

export const MoviePoster = ({
	currentMovie,
	dataIMDB,
	onButtonAction,
	onPreviousButtonClick,
	onEscButtonClick,
	isDisabled,
	isNextDisabled,
	hasNext = true,
}: MoviePosterProps) => {
	const swipeHandlers = useSwipeable({
		onSwiped: (eventData: any) => handleKeyPress(eventData),
	});

	const handleKeyPress = (event: any) => {
		const { dir } = event;
		const { key } = event;

		if ((key === 'ArrowRight' || key === 'Right' || dir === 'Left') && !isNextDisabled && hasNext) {
			onButtonAction();
		}

		if (key === 'ArrowLeft' || key === 'Left' || dir === 'Right') {
			onPreviousButtonClick();
		}

		if (key === 'Escape' || key === 'Esc') {
			onEscButtonClick();
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
		// eslint-disable-next-line
	}, [onButtonAction, onPreviousButtonClick]);

	const [isImageLoaded, setIsImageLoaded] = useState(false);

	useEffect(() => {
		setIsImageLoaded(false);
	}, [currentMovie?.poster_path]);

	return (
		<div {...swipeHandlers} className='poster-button-container'>
			<button onClick={onPreviousButtonClick} className={`button-movie-page ${isDisabled && 'button-disabled'}`}>
				<SkipPreviousIcon />
			</button>
			<div className='poster-container'>
				{!isImageLoaded && <div className='poster-skeleton' />}
				<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
					<img
						className='mobile-poster-img'
						alt={currentMovie?.title}
						style={{ display: isImageLoaded ? 'block' : 'none' }}
						src={`${MOVIE_POSTER_PATH}${currentMovie?.poster_path}`}
						onLoad={() => setIsImageLoaded(true)}
					/>
				</a>
				{isImageLoaded && <MovieRating currentMovie={currentMovie} />}
			</div>
			{hasNext && (
				<button
					onClick={() => !isNextDisabled && onButtonAction()}
					className={`button-movie-page ${isNextDisabled ? 'button-disabled' : ''}`}>
					<SkipNextIcon />
				</button>
			)}
		</div>
	);
};
