import { Rating } from '../../components/Rating/Rating';
import React from 'react';
import './MovieInfo.scss';
import { Movie, CountryResults, AvailabilityInfo } from '../../models/MovieResponse';
import { Plot } from '../Plot/Plot';
import { Poster } from '../Poster/Poster';
import { Streaming } from '../Streaming/Streaming';

export type MovieInfoProps = {
	currentMovie: Movie;
	streamingData: CountryResults | undefined;
	dataIMDB: string;
};

export const MovieInfo = ({ currentMovie, streamingData, dataIMDB }: MovieInfoProps) => {
	/*  const shouldShowPoster: boolean = showMovie && !!randomMovie;
	const shouldShowRating: boolean = showMovie && !!randomMovie?.vote_average;*/
	//	const shouldShowStreamingData: boolean = !!currentMovie && !!streamingData?.flatrate;
	return (
		<>
			<Poster dataIMDB={dataIMDB} currentMovie={currentMovie} />
			<div className='additional-info'>
				<Plot plot={currentMovie.overview} dataIMDB={dataIMDB} />
				<Rating rating={currentMovie.vote_average} />
				<Streaming
					justWatchLink={streamingData?.link as string}
					streamingInfo={streamingData?.flatrate as AvailabilityInfo[]}
				/>
			</div>
		</>
	);
};
