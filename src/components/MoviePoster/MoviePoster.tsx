import React, { useEffect, useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../constants/movie';
import { Movie } from '../../models/MovieResponse';
import './MoviePoster.scss';

export type MoviePosterProps = {
	currentMovie: Movie;
	dataIMDB: string;
	onButtonClick: () => void;
	onPreviousButtonClick: () => void;
	isDisabled: boolean;
};

export const MoviePoster = ({
	currentMovie,
	dataIMDB,
	onButtonClick,
	onPreviousButtonClick,
	isDisabled,
}: MoviePosterProps) => {
	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'ArrowRight' || event.key === 'Right') {
			onButtonClick();
		}

		if (event.key === 'ArrowLeft' || event.key === 'Left') {
			onPreviousButtonClick();
		}
	};

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
		<div className='poster-button-container'>
			<div
				onKeyDown={handleKeyPress}
				onClick={onPreviousButtonClick}
				className={`button-movie-page ${isDisabled && 'button-disabled'}`}>
				<SkipPreviousIcon />
			</div>
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

			<div
				onKeyDown={handleKeyPress}
				onClick={onButtonClick}
				className={`button-movie-page ${loading && 'button-disabled'}`}>
				<SkipNextIcon />
			</div>
		</div>
	);
};
