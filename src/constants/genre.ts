import { SelectOptions } from './selector';

export const MAX_GENRES = 3;

export const mapValueToGenre = (values: MovieGenre[] | null): number[] | null => {
	if (!values?.length) {
		return null;
	}

	const ids = values.map(value => GENRE_NUM[value]).filter((id): id is number => id !== null);

	return ids.length ? ids : null;
};

export enum MovieGenre {
	Action = 'acción',
	Adventure = 'aventuras',
	Animation = 'animación',
	Comedy = 'comedia',
	Crime = 'crimen',
	Documentary = 'documental',
	Drama = 'drama',
	Family = 'familiar',
	Fantasy = 'fantasía',
	History = 'histórica',
	Horror = 'terror',
	Music = 'música',
	Mystery = 'misterio',
	Romance = 'romance',
	ScienceFiction = 'ciencia ficción',
	Thriller = 'thriller',
	War = 'bélica',
	Western = 'western',
	Random = 'random',
}

export const GENRE_NUM: Record<MovieGenre, number | null> = {
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
	[MovieGenre.Random]: null,
} as const;

export const GENRE_EMOJI: Record<MovieGenre, string> = {
	[MovieGenre.Action]: '🔫',
	[MovieGenre.Adventure]: '🗺️',
	[MovieGenre.Animation]: '🎨',
	[MovieGenre.Comedy]: '😂',
	[MovieGenre.Crime]: '🕵️',
	[MovieGenre.Documentary]: '🎥',
	[MovieGenre.Drama]: '🎭',
	[MovieGenre.Family]: '👨‍👩‍👧',
	[MovieGenre.Fantasy]: '🐉',
	[MovieGenre.History]: '🏛️',
	[MovieGenre.Horror]: '👻',
	[MovieGenre.Music]: '🎵',
	[MovieGenre.Mystery]: '🔍',
	[MovieGenre.Romance]: '💔',
	[MovieGenre.ScienceFiction]: '🚀',
	[MovieGenre.Thriller]: '😱',
	[MovieGenre.War]: '⚔️',
	[MovieGenre.Western]: '🤠',
	[MovieGenre.Random]: '🎲',
};

export const genreSelectorOptions: SelectOptions[] = Object.keys(GENRE_NUM).map(genre => ({
	value: genre,
	text: genre,
	emoji: GENRE_EMOJI[genre as MovieGenre],
}));
