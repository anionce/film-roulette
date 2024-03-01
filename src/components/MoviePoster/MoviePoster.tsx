import React, { useEffect, useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useSwipeable } from 'react-swipeable';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import './MoviePoster.scss';

export type MoviePosterProps = {
	currentMovie: Movie;
	dataIMDB: string;
	onButtonAction: () => void;
	onPreviousButtonClick: () => void;
	isDisabled: boolean;
};

export const MoviePoster = ({
	currentMovie,
	dataIMDB,
	onButtonAction,
	onPreviousButtonClick,
	isDisabled,
}: MoviePosterProps) => {
	const swipeHandlers = useSwipeable({
		onSwiped: (eventData: any) => handleKeyPress(eventData),
	});

	const handleKeyPress = (event: any) => {
		const { dir } = event;
		const { key } = event;

		if (key === 'ArrowRight' || key === 'Right' || dir === 'Left') {
			onButtonAction();
		}

		if (key === 'ArrowLeft' || key === 'Left' || dir === 'Right') {
			onPreviousButtonClick();
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
		// eslint-disable-next-line
	}, [onButtonAction, onPreviousButtonClick]);

	const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	const fetchImage = (src: string) => {
		const loadingImage = new Image();
		loadingImage.src = src;
		loadingImage.onload = () => {
			setCurrentImage(loadingImage.src);
			setLoading(false);
		};
	};

	useEffect(() => {
		setLoading(true);
		fetchImage(`${MOVIE_POSTER_PATH}${currentMovie?.poster_path}`);
	}, [currentMovie]);

	return (
		<div {...swipeHandlers} className='poster-button-container'>
			<button onClick={onPreviousButtonClick} className={`button-movie-page ${isDisabled && 'button-disabled'}`}>
				<SkipPreviousIcon />
			</button>
			<div className='poster-container'>
				<a href={`${MOVIE_IMDB_PATH}${dataIMDB}`} target='_blank' rel='noreferrer'>
					<img
						className='mobile-poster-img'
						alt={currentMovie?.title}
						style={{
							filter: `${loading ? 'blur(10px)' : ''}`,
							transition: '1s filter linear',
							width: '100%',
							background: 'transparent',
						}}
						src={currentImage}
					/>
				</a>
			</div>
			<button onClick={onButtonAction} className={`button-movie-page ${loading && 'button-disabled'}`}>
				<SkipNextIcon />
			</button>
		</div>
	);
};
