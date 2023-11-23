import { MovieGenre } from './genre';
import { MovieRuntime } from './runtime';
import { StreamingServices } from './streamingServices';

export enum FilterType {
	Duration = 'duration',
	Genre = 'genre',
	Streaming = 'streaming',
}

export const filterTypes = [FilterType.Genre, FilterType.Duration, FilterType.Streaming];

export type ModalOpen = {
	[FilterType.Genre]: boolean;
	[FilterType.Duration]: boolean;
	[FilterType.Streaming]: boolean;
};

export type FilterArguments = {
	genre: MovieGenre | null;
	duration: MovieRuntime | null;
	streaming: StreamingServices[] | null;
};
