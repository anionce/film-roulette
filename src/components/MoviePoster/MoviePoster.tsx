import { useEffect, useEffectEvent, useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useSwipeable } from 'react-swipeable';
import { MOVIE_IMDB_PATH, MOVIE_POSTER_PATH } from '../../constants/movie';
import { useLanguage } from '../../i18n/useLanguage';
import type { Movie } from '../../models/MovieResponse';
import { MovieRating } from '../MovieRating/MovieRating';
import './MoviePoster.scss';

type MoviePosterProps = {
	movie: Movie;
	imdbId?: string;
	canGoBack: boolean;
	canGoNext: boolean;
	isNextBusy: boolean;
	onNext: () => void;
	onPrevious: () => void;
	onExit: () => void;
};

const NEXT_KEYS = ['ArrowRight', 'Right'];
const PREVIOUS_KEYS = ['ArrowLeft', 'Left'];
const EXIT_KEYS = ['Escape', 'Esc'];

const PosterImage = ({ movie, imdbId }: { movie: Movie; imdbId?: string }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div className='poster-container'>
			{!isLoaded && <div className='poster-skeleton' />}
			<a href={`${MOVIE_IMDB_PATH}${imdbId ?? ''}`} target='_blank' rel='noreferrer'>
				<img
					className='mobile-poster-img'
					alt={movie.title}
					style={{ display: isLoaded ? 'block' : 'none' }}
					src={`${MOVIE_POSTER_PATH}${movie.poster_path}`}
					onLoad={() => setIsLoaded(true)}
				/>
			</a>
			{isLoaded && <MovieRating movie={movie} />}
		</div>
	);
};

export const MoviePoster = ({
	movie,
	imdbId,
	canGoBack,
	canGoNext,
	isNextBusy,
	onNext,
	onPrevious,
	onExit,
}: MoviePosterProps) => {
	const { t } = useLanguage();
	const goNext = () => canGoNext && !isNextBusy && onNext();

	const swipeHandlers = useSwipeable({
		onSwipedLeft: goNext,
		onSwipedRight: onPrevious,
	});

	const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
		if (NEXT_KEYS.includes(event.key)) goNext();
		if (PREVIOUS_KEYS.includes(event.key)) onPrevious();
		if (EXIT_KEYS.includes(event.key)) onExit();
	});

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<div {...swipeHandlers} className='poster-button-container'>
			<button
				type='button'
				onClick={onPrevious}
				disabled={!canGoBack}
				aria-label={t.previousMovieAriaLabel}
				className={`button-movie-page ${canGoBack ? '' : 'button-disabled'}`}
			>
				<SkipPreviousIcon />
			</button>
			<PosterImage key={movie.id} movie={movie} imdbId={imdbId} />
			{canGoNext && (
				<button
					type='button'
					onClick={goNext}
					disabled={isNextBusy}
					aria-label={t.nextMovieAriaLabel}
					className={`button-movie-page ${isNextBusy ? 'button-disabled' : ''}`}
				>
					<SkipNextIcon />
				</button>
			)}
		</div>
	);
};
