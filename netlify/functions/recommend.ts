import type { RecommendationErrorKind } from '../../src/models/Recommendation';
import { GeminiError, QUOTA_EXCEEDED_STATUS, requestRecommendations } from '../lib/gemini';
import { validatePrompt } from '../lib/prompt';
import { createRateLimiter } from '../lib/rateLimiter';

const REQUESTS_PER_MINUTE = 10;
const ONE_MINUTE_MS = 60_000;
const isRateLimited = createRateLimiter(REQUESTS_PER_MINUTE, ONE_MINUTE_MS);

const STATUS_BY_ERROR: Record<RecommendationErrorKind, number> = {
	notMovies: 422,
	quotaExceeded: 429,
	failed: 500,
};

const json = (body: unknown, status = 200) => Response.json(body, { status });

const fail = (kind: RecommendationErrorKind) => json({ error: kind }, STATUS_BY_ERROR[kind]);

const readPrompt = async (request: Request): Promise<string | null> => {
	try {
		return validatePrompt(((await request.json()) as { prompt?: unknown }).prompt);
	} catch {
		return null;
	}
};

export default async (request: Request, context: { ip: string }): Promise<Response> => {
	const apiKey = process.env.GEMINI_API_KEY;
	if (request.method !== 'POST' || !apiKey) return fail('failed');
	if (isRateLimited(context.ip)) return fail('quotaExceeded');

	const prompt = await readPrompt(request);
	if (!prompt) return fail('failed');

	try {
		const { isMovieRequest, recommendations } = await requestRecommendations(prompt, apiKey, process.env.GEMINI_MODEL);
		return isMovieRequest && recommendations.length ? json({ recommendations }) : fail('notMovies');
	} catch (error) {
		return fail(error instanceof GeminiError && error.status === QUOTA_EXCEEDED_STATUS ? 'quotaExceeded' : 'failed');
	}
};
