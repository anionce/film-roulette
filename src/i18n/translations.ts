export type Language = 'es' | 'en';

export type Translations = {
	introGreeting: string;
	labelGenre: string;
	labelDuration: string;
	labelStreaming: string;
	labelEra: string;
	genreModalTitle: (max: number) => string;
	durationModalTitle: string;
	eraModalTitle: string;
	genreMaxHint: (max: number) => string;
	streamingModalTitle: string;
	confirmAriaLabel: string;
	randomButton: string;
	randomAriaLabel: string;
	searchButton: string;
	searchAriaLabel: string;
	apiErrorText: string;
	retryButton: string;
	noResultsTitle: string;
	noResultsDefaultMessage: string;
	noResultsGenreComboMessage: string;
	goHomeButton: string;
	exitAriaLabel: string;
	closeAriaLabel: string;
	fewResultsText: (count: number) => string;
	loaderText: string;
	languageToggleAriaLabel: string;
	readMoreLabel: string;
	availableOnLabel: string;
};

export const translations: Record<Language, Translations> = {
	es: {
		introGreeting: '¡Hola! Vamos a elegir algo buenísimo para ver 🤗',
		labelGenre: 'Género',
		labelDuration: 'Duración',
		labelStreaming: 'Plataformas',
		labelEra: 'Época',
		genreModalTitle: max => `Elige hasta ${max} géneros que te apetezcan hoy`,
		durationModalTitle: '¿Cuánto tiempo tienes?',
		eraModalTitle: '¿De qué época?',
		genreMaxHint: max => `Ya has elegido ${max} — toca uno para cambiarlo`,
		streamingModalTitle: 'Selecciona tus plataformas:',
		confirmAriaLabel: 'Aceptar selección',
		randomButton: '¡Random!',
		randomAriaLabel: 'Elegir película al azar',
		searchButton: 'Buscar',
		searchAriaLabel: 'Buscar película',
		apiErrorText: 'Vaya, algo ha fallado al buscar películas.',
		retryButton: 'Reintentar',
		noResultsTitle: '¡Vaya, nada por aquí!',
		noResultsDefaultMessage: 'No hemos encontrado ninguna película con esos filtros. Prueba a cambiar alguno.',
		noResultsGenreComboMessage: 'No hemos encontrado películas que combinen esos géneros. Prueba con menos.',
		goHomeButton: 'Volver a elegir',
		exitAriaLabel: 'Volver al inicio',
		closeAriaLabel: 'Cerrar',
		fewResultsText: count => `Solo hemos encontrado ${count} películas con estos filtros`,
		loaderText: 'Buscando algo buenísimo…',
		languageToggleAriaLabel: 'Cambiar idioma',
		readMoreLabel: 'Ver más',
		availableOnLabel: 'Disponible en',
	},
	en: {
		introGreeting: "Hi! Let's pick something awesome to watch 🤗",
		labelGenre: 'Genre',
		labelDuration: 'Duration',
		labelStreaming: 'Platforms',
		labelEra: 'Era',
		genreModalTitle: max => `Pick up to ${max} genres you're in the mood for`,
		durationModalTitle: 'How much time do you have?',
		eraModalTitle: 'Which era?',
		genreMaxHint: max => `You already picked ${max} — tap one to swap it`,
		streamingModalTitle: 'Select your platforms:',
		confirmAriaLabel: 'Confirm selection',
		randomButton: 'Random!',
		randomAriaLabel: 'Pick a random movie',
		searchButton: 'Search',
		searchAriaLabel: 'Search for a movie',
		apiErrorText: 'Oops, something went wrong while searching for movies.',
		retryButton: 'Retry',
		noResultsTitle: 'Oops, nothing here!',
		noResultsDefaultMessage: "We couldn't find any movie with those filters. Try changing one.",
		noResultsGenreComboMessage: "We couldn't find movies combining those genres. Try fewer.",
		goHomeButton: 'Back to filters',
		exitAriaLabel: 'Back home',
		closeAriaLabel: 'Close',
		fewResultsText: count => `We only found ${count} movies with these filters`,
		loaderText: 'Looking for something great…',
		languageToggleAriaLabel: 'Switch language',
		readMoreLabel: 'Read more',
		availableOnLabel: 'Available on',
	},
};
