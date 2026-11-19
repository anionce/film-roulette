import { describe, expect, it } from 'vitest';
import { MovieEra } from '../constants/era';
import { FilterType } from '../constants/filters';
import { MovieGenre } from '../constants/genre';
import { MovieRuntime } from '../constants/runtime';
import { StreamingServices } from '../constants/streamingServices';
import { canPickRandom, canSearch, EMPTY_FILTERS, hasAnyFilter, hasSelection, toggleGenre } from './filters';

describe('toggleGenre', () => {
	it('adds and removes genres, clearing the filter when none is left', () => {
		const withComedy = toggleGenre(EMPTY_FILTERS, MovieGenre.Comedy);
		expect(withComedy.genre).toEqual([MovieGenre.Comedy]);
		expect(toggleGenre(withComedy, MovieGenre.Comedy).genre).toBeNull();
	});

	it('ignores new genres once the maximum is reached', () => {
		const full = { ...EMPTY_FILTERS, genre: [MovieGenre.Comedy, MovieGenre.Drama, MovieGenre.Horror] };
		expect(toggleGenre(full, MovieGenre.Action).genre).toEqual(full.genre);
	});
});

describe('selection checks', () => {
	const allSet = {
		genre: [MovieGenre.Comedy],
		duration: MovieRuntime.Short,
		streaming: [StreamingServices.Netflix],
		era: MovieEra.Decade90,
	};

	it('detects selections in single and multi-value filters', () => {
		expect(hasSelection(EMPTY_FILTERS, FilterType.Genre)).toBe(false);
		expect(hasSelection({ ...EMPTY_FILTERS, streaming: [] }, FilterType.Streaming)).toBe(false);
		expect(hasSelection(allSet, FilterType.Era)).toBe(true);
		expect(hasAnyFilter(EMPTY_FILTERS)).toBe(false);
		expect(hasAnyFilter({ ...EMPTY_FILTERS, duration: MovieRuntime.Long })).toBe(true);
	});

	it('needs a genre to search', () => {
		expect(canSearch(EMPTY_FILTERS)).toBe(false);
		expect(canSearch({ ...EMPTY_FILTERS, duration: MovieRuntime.Short })).toBe(false);
		expect(canSearch({ ...EMPTY_FILTERS, genre: [MovieGenre.Comedy] })).toBe(true);
	});

	it('only allows a random pick while some filter is still open', () => {
		expect(canPickRandom(EMPTY_FILTERS)).toBe(true);
		expect(canPickRandom(allSet)).toBe(false);
	});
});
