import Disney from '../assets/img/streaming-services/disney.jpeg';
import SkyShowtime from '../assets/img/streaming-services/sky-showtime.jpeg';
import Filmin from '../assets/img/streaming-services/filmin.jpeg';
import HBOMax from '../assets/img/streaming-services/hbo-max.jpeg';
import PrimeVideo from '../assets/img/streaming-services/prime.jpeg';
import MovistarPlus from '../assets/img/streaming-services/movistar.jpeg';
import Netflix from '../assets/img/streaming-services/netflix.jpeg';
import PlutoTV from '../assets/img/streaming-services/pluto-tv.jpeg';
import RTVE from '../assets/img/streaming-services/rtve.jpeg';

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
	MovistarPlus = 'Movistar Plus',
	PlutoTV = 'Pluto TV',
	RTVE = 'RTVE Play',
}

export const streamingServices = [
	{ name: StreamingServices.Disney, logo: Disney },
	{ name: StreamingServices.Filmin, logo: Filmin },
	{ name: StreamingServices.HBOMax, logo: HBOMax },
	{ name: StreamingServices.MovistarPlus, logo: MovistarPlus },
	{ name: StreamingServices.Netflix, logo: Netflix },
	{ name: StreamingServices.PrimeVideo, logo: PrimeVideo },
	{ name: StreamingServices.SkyShowtime, logo: SkyShowtime },
	{ name: StreamingServices.PlutoTV, logo: PlutoTV },
	{ name: StreamingServices.RTVE, logo: RTVE },
];

export const STREAMING_ID: Record<StreamingServices, number> = {
	[StreamingServices.Disney]: 337,
	[StreamingServices.Filmin]: 63,
	[StreamingServices.HBOMax]: 384,
	[StreamingServices.MovistarPlus]: 149,
	[StreamingServices.Netflix]: 8,
	[StreamingServices.PrimeVideo]: 119,
	[StreamingServices.SkyShowtime]: 1773,
	[StreamingServices.PlutoTV]: 300,
	[StreamingServices.RTVE]: 541,
};

export const STREAMING_LOGO: Record<StreamingServices, string> = {
	[StreamingServices.Disney]: Disney,
	[StreamingServices.Filmin]: Filmin,
	[StreamingServices.HBOMax]: HBOMax,
	[StreamingServices.MovistarPlus]: MovistarPlus,
	[StreamingServices.Netflix]: Netflix,
	[StreamingServices.PrimeVideo]: PrimeVideo,
	[StreamingServices.SkyShowtime]: SkyShowtime,
	[StreamingServices.PlutoTV]: PlutoTV,
	[StreamingServices.RTVE]: RTVE,
};
