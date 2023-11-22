import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Movie, CountryResults } from '../../../models/MovieResponse';
import './MoviePage.scss';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { NoResults } from '../../components/NoResults/NoResults';
import { Streaming } from '../../components/Streaming/Streaming';
import { MoviePoster } from '../../components/MoviePoster/MoviePoster';
import { MoviePlot } from '../../components/MoviePlot/MoviePlot';
import { MovieRating } from '../../components/MovieRating/MovieRating';
import { FewResults } from '../../components/FewResults/FewResults';

export type MoviePageProps = {
	currentMovie: Movie;
	streamingData: CountryResults | undefined;
	dataIMDB: string;
	onButtonClick: any;
	onPreviousButtonClick: any;
	resetValues: any;
	currentMovieIndex: any;
	shouldShowNoResults: any;
	isLoadingMovies: boolean;
	shouldShowFewResults: boolean;
};

export const MoviePage = ({
	currentMovie,
	isLoadingMovies,
	streamingData,
	dataIMDB,
	onButtonClick,
	onPreviousButtonClick,
	resetValues,
	currentMovieIndex,
	shouldShowNoResults,
	shouldShowFewResults,
}: MoviePageProps) => {
	const navigate = useNavigate();

	const isDisabled = currentMovieIndex === 0;

	const goToHome = () => {
		navigate('/');
		resetValues();
	};

	return (
		<div className='movie-page-container'>
			{isLoadingMovies && <Loader />}
			<div className='exit-button-container' onClick={goToHome}>
				<div className='exit-button-movie-page'>
					<CloseIcon />
				</div>
			</div>
			{shouldShowNoResults && <NoResults />}
			{currentMovie && (
				<div className='movie-info-container'>
					<MoviePoster
						isDisabled={isDisabled}
						dataIMDB={dataIMDB}
						onButtonClick={onButtonClick}
						onPreviousButtonClick={onPreviousButtonClick}
						currentMovie={currentMovie}
					/>
					<MoviePlot currentMovie={currentMovie} dataIMDB={dataIMDB} />
					<MovieRating currentMovie={currentMovie} />
					<Streaming streamingData={streamingData} />
				</div>
			)}
			{shouldShowFewResults && <FewResults />}
		</div>
	);
};
