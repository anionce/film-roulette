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
	previousMovieAriaLabel: string;
	nextMovieAriaLabel: string;
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
	appName: string;
	appTagline: string;
	clearFiltersButton: string;
	clearSelectionButton: string;
	aiPromptLabel: string;
	aiPromptPlaceholder: string;
	aiPromptButton: string;
	aiNotMoviesMessage: string;
	aiUnavailableMessage: string;
	aiQuotaMessage: string;
	watchlistLabel: string;
	watchlistPlaceholder: string;
	watchlistButton: string;
	watchlistHint: string;
	watchlistNoMatchMessage: string;
	watchlistNotFoundMessage: string;
	watchlistEmptyMessage: string;
	watchlistNoMoviesMessage: string;
	watchlistRateLimitedMessage: string;
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
		previousMovieAriaLabel: 'Película anterior',
		nextMovieAriaLabel: 'Siguiente película',
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
		appName: 'Film Roulette',
		appTagline: 'Descubre entre miles de películas',
		clearFiltersButton: 'Borrar filtros',
		clearSelectionButton: 'Borrar selección',
		aiPromptLabel: 'O cuéntale a la IA qué te apetece',
		aiPromptPlaceholder: 'Ej: un thriller de atracos que no dure mucho',
		aiPromptButton: 'Recomiéndame',
		aiNotMoviesMessage: 'Solo puedo recomendarte películas. Cuéntame qué te apetece ver.',
		aiUnavailableMessage:
			'Ninguna de las recomendaciones está disponible ahora mismo en España. Prueba con otra descripción.',
		aiQuotaMessage: 'La IA ha llegado a su límite gratuito por ahora. Inténtalo de nuevo más tarde o usa los filtros.',
		watchlistLabel: 'O elige de tu lista de Letterboxd o JustWatch',
		watchlistPlaceholder: 'Usuario de Letterboxd o enlace de JustWatch',
		watchlistButton: 'Elegir',
		watchlistHint:
			'Usa tus filtros sobre las películas de tu lista pública. En JustWatch, comparte una lista y pega su enlace. No hace falta contraseña.',
		watchlistNoMatchMessage: 'Ninguna película de tu watchlist encaja con esos filtros ahora mismo. Prueba a cambiar alguno.',
		watchlistNotFoundMessage: 'No encontramos esa lista o ese usuario. Revisa el nombre o el enlace.',
		watchlistEmptyMessage: 'Esa lista está vacía o es privada. Hazla pública para poder usarla.',
		watchlistNoMoviesMessage: 'Esa lista no tiene películas, solo series. Prueba con otra.',
		watchlistRateLimitedMessage: 'Demasiados intentos seguidos. Espera un minuto y vuelve a probar.',
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
		previousMovieAriaLabel: 'Previous movie',
		nextMovieAriaLabel: 'Next movie',
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
		appName: 'Film Roulette',
		appTagline: 'Discover thousands of movies',
		clearFiltersButton: 'Clear filters',
		clearSelectionButton: 'Clear selection',
		aiPromptLabel: 'Or tell the AI what you feel like',
		aiPromptPlaceholder: 'E.g. a heist thriller that is not too long',
		aiPromptButton: 'Recommend',
		aiNotMoviesMessage: 'I can only recommend movies. Tell me what you feel like watching.',
		aiUnavailableMessage: 'None of the recommendations are available in Spain right now. Try a different description.',
		aiQuotaMessage: 'The AI has reached its free limit for now. Try again later or use the filters.',
		watchlistLabel: 'Or pick from your Letterboxd or JustWatch list',
		watchlistPlaceholder: 'Letterboxd username or JustWatch link',
		watchlistButton: 'Pick',
		watchlistHint:
			'Applies your filters to the films in your public list. On JustWatch, share a list and paste its link. No password needed.',
		watchlistNoMatchMessage: 'No film in your watchlist matches those filters right now. Try changing one.',
		watchlistNotFoundMessage: "We couldn't find that list or user. Check the name or the link.",
		watchlistEmptyMessage: 'That list is empty or private. Make it public to use it.',
		watchlistNoMoviesMessage: 'That list has no movies, only shows. Try another one.',
		watchlistRateLimitedMessage: 'Too many attempts in a row. Wait a minute and try again.',
	},
};
