import './Streaming.scss';
import { AvailabilityInfo, CountryResults } from '../../models/MovieResponse';
import { MOVIE_POSTER_PATH } from '../../constants/movie';

export type StreamingProps = {
	streamingData: CountryResults | undefined;
};

export const Streaming = ({ streamingData }: StreamingProps) => {
	const { flatrate, free, ads, link: justWatchLink } = streamingData || {};
	const streamingInfo = [...(flatrate ?? []), ...(free ?? []), ...(ads ?? [])].filter(
		(info, index, all) => all.findIndex(other => other.provider_id === info.provider_id) === index
	);

	return (
		<div className='streaming-container'>
			{streamingInfo.map((info: AvailabilityInfo) => {
				return (
					<a
						key={info.provider_id}
						className='streaming-tile'
						href={justWatchLink}
						target='_blank'
						rel='noreferrer'>
						<img
							className='streaming-logo'
							key={info.provider_id}
							alt={info.provider_name}
							src={`${MOVIE_POSTER_PATH}${info.logo_path}`}
						/>
					</a>
				);
			})}
		</div>
	);
};
