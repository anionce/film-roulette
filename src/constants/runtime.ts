import { SelectOptions } from './selector';

export const mapValueToMovieRuntime = (value: MovieRuntime): number => {
	return RUNTIME_LENGTH[value];
};

export enum MovieRuntime {
	Short = 'short',
	Medium = 'medium',
	Long = 'long',
}

export const runtimeSelectorOptions: SelectOptions[] = [
	{ value: MovieRuntime.Short, text: '1.30 h' },
	{ value: MovieRuntime.Medium, text: '2 horas' },
	{ value: MovieRuntime.Long, text: '> 2 horas' },
];

export const RUNTIME_LENGTH: Record<MovieRuntime, number> = {
	[MovieRuntime.Short]: 95,
	[MovieRuntime.Medium]: 125,
	[MovieRuntime.Long]: 200,
} as const;
