import {
	RECOMMENDATION_ERROR_KINDS,
	type Recommendation,
	type RecommendationErrorKind,
	type RecommendationResponse,
} from '../models/Recommendation';
import { readErrorKind } from './apiErrors';

const RECOMMEND_ENDPOINT = '/api/recommend';

export class RecommendationError extends Error {
	readonly kind: RecommendationErrorKind;

	constructor(kind: RecommendationErrorKind) {
		super(`Recommendation request failed: ${kind}`);
		this.kind = kind;
	}
}

export const fetchRecommendations = async (prompt: string, signal?: AbortSignal): Promise<Recommendation[]> => {
	const response = await fetch(RECOMMEND_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt }),
		signal,
	});
	if (!response.ok) {
		throw new RecommendationError(await readErrorKind(response, RECOMMENDATION_ERROR_KINDS, 'failed'));
	}
	return ((await response.json()) as RecommendationResponse).recommendations;
};
