import { Rating } from '../../components/Rating/Rating';
import React from 'react';
import './MovieInfo.scss';
import { Movie, CountryResults, AvailabilityInfo } from '../../models/MovieResponse';
import { Plot } from '../Plot/Plot';
import { Poster } from '../Poster/Poster';
import { Streaming } from '../Streaming/Streaming';

export type MovieInfoProps = {
	randomMovie: Movie;
	streamingData: CountryResults | undefined;
	dataIMDB: string;
};

export const MovieInfo = ({ randomMovie, streamingData, dataIMDB }: MovieInfoProps) => {
	/*  const shouldShowPoster: boolean = showMovie && !!randomMovie;
	const shouldShowRating: boolean = showMovie && !!randomMovie?.vote_average;*/
	const shouldShowStreamingData: boolean = !!randomMovie && !!streamingData?.flatrate;
	return (
		<>
			<Poster dataIMDB={dataIMDB} randomMovie={randomMovie} />
			<div className='additional-info'>
				<Plot plot={randomMovie.overview} dataIMDB={dataIMDB} />
				<Rating rating={randomMovie.vote_average} />
				<Streaming
					shouldShowStreamingData={shouldShowStreamingData}
					justWatchLink={streamingData?.link as string}
					streamingInfo={streamingData?.flatrate as AvailabilityInfo[]}
				/>
			</div>
		</>
	);
};
