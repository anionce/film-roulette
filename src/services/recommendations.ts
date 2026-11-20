import {
	RECOMMENDATION_ERROR_KINDS,
	type Recommendation,
	type RecommendationErrorKind,
	type RecommendationResponse,
} from '../models/Recommendation';

const RECOMMEND_ENDPOINT = '/api/recommend';

export class RecommendationError extends Error {
	readonly kind: RecommendationErrorKind;

	constructor(kind: RecommendationErrorKind) {
		super(`Recommendation request failed: ${kind}`);
		this.kind = kind;
	}
}

const isErrorKind = (value: unknown): value is RecommendationErrorKind => RECOMMENDATION_ERROR_KINDS.some(kind => kind === value);

const readErrorKind = async (response: Response): Promise<RecommendationErrorKind> => {
	try {
		const { error } = (await response.json()) as { error?: unknown };
		return isErrorKind(error) ? error : 'failed';
	} catch {
		return 'failed';
	}
};

export const fetchRecommendations = async (prompt: string, signal?: AbortSignal): Promise<Recommendation[]> => {
	const response = await fetch(RECOMMEND_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt }),
		signal,
	});
	if (!response.ok) throw new RecommendationError(await readErrorKind(response));
	return ((await response.json()) as RecommendationResponse).recommendations;
};
