import { describe, expect, it, vi } from 'vitest';
import { GeminiError, parseRecommendations, requestRecommendations } from './gemini';
import { RECOMMENDATIONS_COUNT } from './prompt';

const geminiResponse = (text: string, status = 200) =>
	new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status });

describe('parseRecommendations', () => {
	it('keeps valid recommendations and drops malformed ones', () => {
		const text = JSON.stringify({
			isMovieRequest: true,
			recommendations: [
				{ title: ' Heat ', year: 1995 },
				{ title: '', year: 2000 },
				{ year: 1999 },
				null,
				{ title: 'Ronin', year: 'x' },
			],
		});

		expect(parseRecommendations(text)).toEqual({
			isMovieRequest: true,
			recommendations: [
				{ title: 'Heat', year: 1995 },
				{ title: 'Ronin', year: null },
			],
		});
	});

	it('limits how many recommendations are returned', () => {
		const recommendations = Array.from({ length: RECOMMENDATIONS_COUNT + 10 }, (_, index) => ({
			title: `Movie ${index}`,
			year: 2000,
		}));

		expect(parseRecommendations(JSON.stringify({ isMovieRequest: true, recommendations })).recommendations).toHaveLength(
			RECOMMENDATIONS_COUNT
		);
	});

	it('is not a movie request unless Gemini says so explicitly', () => {
		expect(parseRecommendations('{"recommendations":[]}').isMovieRequest).toBe(false);
	});

	it('rejects payloads that are not JSON objects', () => {
		expect(() => parseRecommendations('not json')).toThrow(SyntaxError);
		expect(() => parseRecommendations('42')).toThrow(SyntaxError);
	});
});

describe('requestRecommendations', () => {
	it('sends the prompt with the key and a schema constrained JSON response', async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue(geminiResponse('{"isMovieRequest":true,"recommendations":[{"title":"Heat","year":1995}]}'));

		const result = await requestRecommendations('heist movies', 'secret', 'test-model', fetcher);

		expect(result.recommendations).toEqual([{ title: 'Heat', year: 1995 }]);
		const [url, init] = fetcher.mock.calls[0];
		expect(url).toContain('/test-model:generateContent');
		expect(init.headers['x-goog-api-key']).toBe('secret');
		const body = JSON.parse(init.body);
		expect(body.contents[0].parts[0].text).toBe('heist movies');
		expect(body.generationConfig.responseMimeType).toBe('application/json');
		expect(body.systemInstruction.parts[0].text).toContain('feature films');
	});

	it('exposes the status of failed requests', async () => {
		const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status: 429 }));

		await expect(requestRecommendations('x', 'key', undefined, fetcher)).rejects.toEqual(new GeminiError(429));
	});

	it('fails when Gemini returns no text', async () => {
		const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [] })));

		await expect(requestRecommendations('x', 'key', undefined, fetcher)).rejects.toThrow(SyntaxError);
	});
});
