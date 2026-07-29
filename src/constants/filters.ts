import { MovieGenre } from './genre';
import { MovieRuntime } from './runtime';
import { StreamingServices } from './streamingServices';
import { MovieEra } from './era';

export enum FilterType {
	Duration = 'duration',
	Genre = 'genre',
	Streaming = 'streaming',
	Era = 'era',
}

export const filterTypes = [FilterType.Genre, FilterType.Duration, FilterType.Era, FilterType.Streaming];

export type ModalOpen = {
	[FilterType.Genre]: boolean;
	[FilterType.Duration]: boolean;
	[FilterType.Streaming]: boolean;
	[FilterType.Era]: boolean;
};

export type FilterArguments = {
	genre: MovieGenre[] | null;
	duration: MovieRuntime | null;
	streaming: StreamingServices[] | null;
	era: MovieEra | null;
};
