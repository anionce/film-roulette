import { SelectOptions } from './selector';

export const mapValueToGenre = (value: MovieGenre): number[] => {
	return [GENRE_NUM[value]];
};

export enum MovieGenre {
	Action = 'action',
	Adventure = 'adventure',
	Animation = 'animation',
	Comedy = 'comedy',
	Crime = 'crime',
	Documentary = 'documentary',
	Drama = 'drama',
	Family = 'family',
	Fantasy = 'fantasy',
	History = 'history',
	Horror = 'horror',
	Music = 'music',
	Mystery = 'mistery',
	Romance = 'romance',
	ScienceFiction = 'scifi',
	Thriller = 'thriller',
	War = 'war',
	Western = 'western',
}

export const genreSelectorOptions: SelectOptions[] = [
	{ value: MovieGenre.Comedy, text: 'happy' },
	{ value: MovieGenre.Drama, text: 'sad' },
	{ value: MovieGenre.Adventure, text: 'adventurous' },
	{ value: MovieGenre.Horror, text: 'scary' },
	{ value: MovieGenre.Thriller, text: 'mysterious' },
	{ value: MovieGenre.History, text: 'educational' },
];

export const GENRE_NUM: Record<MovieGenre, number> = {
	[MovieGenre.Action]: 28,
	[MovieGenre.Adventure]: 12,
	[MovieGenre.Animation]: 16,
	[MovieGenre.Comedy]: 35,
	[MovieGenre.Crime]: 80,
	[MovieGenre.Documentary]: 99,
	[MovieGenre.Drama]: 18,
	[MovieGenre.Family]: 10751,
	[MovieGenre.Fantasy]: 14,
	[MovieGenre.History]: 36,
	[MovieGenre.Horror]: 27,
	[MovieGenre.Music]: 10402,
	[MovieGenre.Mystery]: 9648,
	[MovieGenre.Romance]: 10749,
	[MovieGenre.ScienceFiction]: 878,
	[MovieGenre.Thriller]: 53,
	[MovieGenre.War]: 10752,
	[MovieGenre.Western]: 37,
} as const;
