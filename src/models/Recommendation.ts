export type Recommendation = {
	title: string;
	year: number | null;
};

export type RecommendationResponse = {
	recommendations: Recommendation[];
};

export const RECOMMENDATION_ERROR_KINDS = ['notMovies', 'quotaExceeded', 'failed'] as const;

export type RecommendationErrorKind = (typeof RECOMMENDATION_ERROR_KINDS)[number];

export const MAX_PROMPT_LENGTH = 300;
