import { genreSelectorOptions } from './genre';
import { runtimeSelectorOptions } from './runtime';

export type SelectOptions = {
	value: string;
	text: string;
};

export enum SelectValue {
	Runtime = 'runtime',
	Genre = 'genre',
}

export const getOptionsForSelector = (value: SelectValue) => {
	if (value === SelectValue.Genre) {
		return genreSelectorOptions;
	} else {
		return runtimeSelectorOptions;
	}
};
