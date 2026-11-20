import type { Recommendation } from '../../src/models/Recommendation';
import { RECOMMENDATIONS_COUNT, RESPONSE_SCHEMA, SYSTEM_INSTRUCTION } from './prompt';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';
const TEMPERATURE = 0.7;
const MAX_OUTPUT_TOKENS = 1024;
export const QUOTA_EXCEEDED_STATUS = 429;

export type GeminiRecommendations = {
	isMovieRequest: boolean;
	recommendations: Recommendation[];
};

export class GeminiError extends Error {
	readonly status: number;

	constructor(status: number) {
		super(`Gemini request failed with status ${status}`);
		this.status = status;
	}
}

const toRecommendation = (value: unknown): Recommendation | null => {
	if (typeof value !== 'object' || value === null) return null;
	const { title, year } = value as Record<string, unknown>;
	if (typeof title !== 'string' || !title.trim()) return null;
	return { title: title.trim(), year: Number.isInteger(year) ? (year as number) : null };
};

export const parseRecommendations = (text: string): GeminiRecommendations => {
	const parsed: unknown = JSON.parse(text);
	if (typeof parsed !== 'object' || parsed === null) throw new SyntaxError('Unexpected Gemini payload');
	const { isMovieRequest, recommendations } = parsed as Record<string, unknown>;
	const items = Array.isArray(recommendations) ? recommendations : [];

	return {
		isMovieRequest: isMovieRequest === true,
		recommendations: items
			.map(toRecommendation)
			.filter((item): item is Recommendation => item !== null)
			.slice(0, RECOMMENDATIONS_COUNT),
	};
};

const extractText = (body: unknown): string => {
	const candidates = (body as { candidates?: { content?: { parts?: { text?: string }[] } }[] }).candidates;
	const text = candidates?.[0]?.content?.parts?.[0]?.text;
	if (!text) throw new SyntaxError('Gemini returned no text');
	return text;
};

export const requestRecommendations = async (
	prompt: string,
	apiKey: string,
	model = DEFAULT_GEMINI_MODEL,
	fetcher: typeof fetch = fetch
): Promise<GeminiRecommendations> => {
	const response = await fetcher(`${GEMINI_BASE_URL}/${model}:generateContent`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
		body: JSON.stringify({
			systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: RESPONSE_SCHEMA,
				temperature: TEMPERATURE,
				maxOutputTokens: MAX_OUTPUT_TOKENS,
			},
		}),
	});
	if (!response.ok) throw new GeminiError(response.status);
	return parseRecommendations(extractText(await response.json()));
};
