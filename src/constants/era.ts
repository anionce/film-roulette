import { SelectOptions } from './selector';
import { Language } from '../i18n/translations';

export enum MovieEra {
	LastYear = 'último año',
	Century21 = 'SIGLO XXI',
	Decade90 = 'años 90',
	Decade80 = 'años 80',
	Decade70 = 'años 70',
	Classic = 'clásicas',
}

export const ERA_LABEL_EN: Record<MovieEra, string> = {
	[MovieEra.LastYear]: 'last year',
	[MovieEra.Century21]: '21st century',
	[MovieEra.Decade90]: '90s',
	[MovieEra.Decade80]: '80s',
	[MovieEra.Decade70]: '70s',
	[MovieEra.Classic]: 'classics',
};

export const getEraLabel = (era: MovieEra, language: Language): string =>
	language === 'en' ? ERA_LABEL_EN[era] : era;

export const ERA_EMOJI: Record<MovieEra, string> = {
	[MovieEra.LastYear]: '✨',
	[MovieEra.Century21]: '🌐',
	[MovieEra.Decade90]: '📼',
	[MovieEra.Decade80]: '📺',
	[MovieEra.Decade70]: '🕺',
	[MovieEra.Classic]: '🎞️',
};

export type EraRange = { gte?: string; lte?: string };

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const getLastYearRange = (): EraRange => {
	const today = new Date();
	const oneYearAgo = new Date(today);
	oneYearAgo.setFullYear(today.getFullYear() - 1);

	return { gte: formatDate(oneYearAgo), lte: formatDate(today) };
};

export const ERA_RANGE: Record<MovieEra, EraRange> = {
	[MovieEra.LastYear]: getLastYearRange(),
	[MovieEra.Century21]: { gte: '2000-01-01' },
	[MovieEra.Decade90]: { gte: '1990-01-01', lte: '1999-12-31' },
	[MovieEra.Decade80]: { gte: '1980-01-01', lte: '1989-12-31' },
	[MovieEra.Decade70]: { gte: '1970-01-01', lte: '1979-12-31' },
	[MovieEra.Classic]: { lte: '1969-12-31' },
};

export const mapValueToEraRange = (value: MovieEra | null): EraRange | null => {
	if (!value) {
		return null;
	}

	return ERA_RANGE[value];
};

export const getEraSelectorOptions = (language: Language): SelectOptions[] =>
	Object.values(MovieEra).map(era => ({
		value: era,
		text: getEraLabel(era, language),
		emoji: ERA_EMOJI[era],
	}));
