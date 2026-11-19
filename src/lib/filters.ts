import { FilterType, type FilterArguments } from '../constants/filters';
import { MAX_GENRES, type MovieGenre } from '../constants/genre';

export const EMPTY_FILTERS: FilterArguments = { genre: null, duration: null, streaming: null, era: null };

export const toggleGenre = (filters: FilterArguments, genre: MovieGenre): FilterArguments => {
	const current = filters.genre ?? [];
	const next = current.includes(genre)
		? current.filter(selected => selected !== genre)
		: current.length < MAX_GENRES
			? [...current, genre]
			: current;
	return { ...filters, genre: next.length ? next : null };
};

export const hasSelection = (filters: FilterArguments, type: FilterType): boolean => {
	const value = filters[type];
	return Array.isArray(value) ? value.length > 0 : !!value;
};

export const hasAnyFilter = (filters: FilterArguments): boolean =>
	Object.values(FilterType).some(type => hasSelection(filters, type));

export const canSearch = (filters: FilterArguments): boolean => hasSelection(filters, FilterType.Genre);

export const canPickRandom = (filters: FilterArguments): boolean =>
	!Object.values(FilterType).every(type => hasSelection(filters, type));
