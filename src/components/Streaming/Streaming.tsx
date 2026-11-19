import { MOVIE_POSTER_PATH } from '../../constants/movie';
import { includedWithSubscription } from '../../lib/movies';
import type { CountryResults } from '../../models/MovieResponse';
import './Streaming.scss';

export const Streaming = ({ availability }: { availability: CountryResults | undefined }) => {
	const providers = includedWithSubscription(availability).filter(
		(provider, index, all) => all.findIndex(other => other.provider_id === provider.provider_id) === index
	);

	return (
		<div className='streaming-container'>
			{providers.map(provider => (
				<a
					key={provider.provider_id}
					className='streaming-tile'
					href={availability?.link}
					target='_blank'
					rel='noreferrer'
				>
					<img
						className='streaming-logo'
						alt={provider.provider_name}
						src={`${MOVIE_POSTER_PATH}${provider.logo_path}`}
					/>
				</a>
			))}
		</div>
	);
};
