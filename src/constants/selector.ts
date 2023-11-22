import { FilterType } from './filters';
import { genreSelectorOptions } from './genre';
import { runtimeSelectorOptions } from './runtime';

export type SelectOptions = {
	value: string;
	text: string;
};

export const getOptionsForSelector = (value: FilterType) => {
	if (value === FilterType.Genre) {
		return genreSelectorOptions;
	} else {
		return runtimeSelectorOptions;
	}
};
