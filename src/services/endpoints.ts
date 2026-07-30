export const BASE_URL = `https://api.themoviedb.org/3/`;

export const TAG = 'movie';

export const DISCOVER = 'discover';

export const TOKEN = process.env.REACT_APP_TOKEN;

export const API_KEY = process.env.REACT_APP_API_KEY;

export const POPULARITY_VALUE = 100;

export const MINIMUM_VOTE = 6.0;

export const LANGUAGE = 'es-ES';

// Pluto TV's catalog in TMDB for Spain is tiny (~70 movies total), so the default
// quality thresholds leave almost nothing. Relax them only when Pluto TV is the
// sole platform selected, so it doesn't drag down results mixed with other platforms.
export const PLUTO_TV_PROVIDER_ID = '300';

export const PLUTO_TV_POPULARITY_VALUE = 20;

export const PLUTO_TV_MINIMUM_VOTE = 5.5;
