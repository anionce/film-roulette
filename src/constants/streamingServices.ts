import Disney from '../assets/img/streaming-services/disney.jpeg';
import SkyShowtime from '../assets/img/streaming-services/sky-showtime.jpeg';
import Filmin from '../assets/img/streaming-services/filmin.jpeg';
import HBOMax from '../assets/img/streaming-services/hbo-max.jpeg';
import PrimeVideo from '../assets/img/streaming-services/prime.jpeg';
import MovistarPlus from '../assets/img/streaming-services/movistar.jpeg';
import Netflix from '../assets/img/streaming-services/netflix.jpeg';

export const mapValueToStreamingService = (values: StreamingServices[] | null): string | null => {
	if (values) {
		return values
			.map(value => {
				return STREAMING_ID[value];
			})
			.join('|');
	}
	return null;
};

export enum StreamingServices {
	Netflix = 'Netflix',
	SkyShowtime = 'SkyShowtime',
	Filmin = 'Filmin',
	HBOMax = 'HBO Max',
	PrimeVideo = 'Prime Video',
	Disney = 'Disney+',
	MovistarPlus = 'MovistarPlus',
}

export const streamingServices = [
	{ name: StreamingServices.Disney, logo: Disney },
	{ name: StreamingServices.Filmin, logo: Filmin },
	{ name: StreamingServices.HBOMax, logo: HBOMax },
	{ name: StreamingServices.MovistarPlus, logo: MovistarPlus },
	{ name: StreamingServices.Netflix, logo: Netflix },
	{ name: StreamingServices.PrimeVideo, logo: PrimeVideo },
	{ name: StreamingServices.SkyShowtime, logo: SkyShowtime },
];

export const STREAMING_ID: Record<StreamingServices, number> = {
	[StreamingServices.Disney]: 337,
	[StreamingServices.Filmin]: 63,
	[StreamingServices.HBOMax]: 384,
	[StreamingServices.MovistarPlus]: 149,
	[StreamingServices.Netflix]: 8,
	[StreamingServices.PrimeVideo]: 119,
	[StreamingServices.SkyShowtime]: 1773,
};
