import React, { useEffect, useState } from 'react';
import { Movie } from '../../models/MovieResponse';
import { useLazyGetDetailsQuery, useLazyGetRandomMovieQuery } from '../../services/api';
import { Loader } from '../../components/Loader/Loader';
import { Poster } from '../../components/Poster/Poster';
import { MovieGenre, mapValueToGenre } from '../../constants/genre';
import { MovieRuntime, mapValueToMovieRuntime } from '../../constants/runtime';
import { GenreSelection } from '../../components/GenreSelection/GenreSelection';
import { RuntimeSelection } from '../../components/RuntimeSelection/RuntimeSelection';
import './Home.scss';
import { Plot } from '../../components/Plot/Plot';
import { Rating } from '../../components/Rating/Rating';

export const Home = () => {
	const [randomMovie, setRandomMovie] = useState<Movie | undefined>(undefined);

	const [duration, setDuration] = useState<MovieRuntime | undefined>(MovieRuntime.Short);
	const [genre, setGenre] = useState<MovieGenre | undefined>(MovieGenre.Action);
	const [actualPage, setActualPage] = useState<number>(1);

	const [trigger, { data: dataRandom, isLoading }] = useLazyGetRandomMovieQuery();
	const [triggerIMDBDetail, { data: dataIMDB }] = useLazyGetDetailsQuery();

	const shouldShowPoster: boolean = !!randomMovie && !!dataIMDB;

	useEffect(() => {
		if (dataRandom) {
			const { total_pages, results } = dataRandom;
			setActualPage(prevPage => (total_pages === actualPage ? 1 : prevPage + 1));
			setRandomMovie(results[Math.floor(Math.random() * results.length)]);
		}
		// eslint-disable-next-line
	}, [dataRandom]);

	useEffect(() => {
		if (randomMovie) {
			triggerIMDBDetail({ id: randomMovie.id });
		}
		// eslint-disable-next-line
	}, [randomMovie]);

	const onButtonClick = () => {
		if (duration && genre) {
			trigger({
				page: actualPage,
				runtime: mapValueToMovieRuntime(duration),
				genres: mapValueToGenre(genre),
			});
		}
	};

	const onDurationChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		setActualPage(1);
		setDuration(event.target.value as MovieRuntime);
	};

	const onGenreChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		setActualPage(1);
		setGenre(event.target.value as MovieGenre);
	};

	return (
		<div className='home-container'>
			<div className='home-left-side'>
				<div className='home-left-container'>
					<GenreSelection onMainGenreChange={onGenreChange} />
					<RuntimeSelection onDurationChange={onDurationChange} />
					<button onClick={onButtonClick}>PLAY</button>
				</div>
			</div>
			<div className='home-right-side'>
				{isLoading && <Loader />}
				{shouldShowPoster && (
					<div className='home-right-container'>
						<Poster dataIMDB={dataIMDB as string} randomMovie={randomMovie as Movie} />
						<div className='additional-info'>
							<Plot plot={(randomMovie as Movie)?.overview} dataIMDB={dataIMDB as string} />
							<Rating rating={(randomMovie as Movie)?.vote_average} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
