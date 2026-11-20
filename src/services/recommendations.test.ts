import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchRecommendations, RecommendationError } from './recommendations';

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('fetchRecommendations', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('posts the prompt and returns the recommendations', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ recommendations: [{ title: 'Heat', year: 1995 }] }));
		vi.stubGlobal('fetch', fetchMock);

		await expect(fetchRecommendations('heist movies')).resolves.toEqual([{ title: 'Heat', year: 1995 }]);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('/api/recommend');
		expect(JSON.parse(init.body)).toEqual({ prompt: 'heist movies' });
	});

	it('maps error responses to their kind', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: 'notMovies' }, 422)));
		await expect(fetchRecommendations('hello')).rejects.toEqual(new RecommendationError('notMovies'));

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: 'quotaExceeded' }, 429)));
		await expect(fetchRecommendations('hello')).rejects.toEqual(new RecommendationError('quotaExceeded'));
	});

	it('treats unknown or unreadable error bodies as a failure', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: 'weird' }, 500)));
		await expect(fetchRecommendations('hello')).rejects.toEqual(new RecommendationError('failed'));

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>', { status: 502 })));
		await expect(fetchRecommendations('hello')).rejects.toEqual(new RecommendationError('failed'));
	});
});
