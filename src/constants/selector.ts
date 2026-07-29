import { FilterType } from './filters';
import { getGenreSelectorOptions } from './genre';
import { runtimeSelectorOptions } from './runtime';
import { getEraSelectorOptions } from './era';
import { Language } from '../i18n/translations';

export type SelectOptions = {
	value: string;
	text: string;
	emoji: string;
};

export const getOptionsForSelector = (value: FilterType, language: Language) => {
	if (value === FilterType.Genre) {
		return getGenreSelectorOptions(language);
	}
	if (value === FilterType.Era) {
		return getEraSelectorOptions(language);
	}
	return runtimeSelectorOptions;
};
