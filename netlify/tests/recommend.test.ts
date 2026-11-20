import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import recommend from '../functions/recommend';

const geminiReply = (payload: unknown, status = 200) =>
	new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }] }), { status });

let nextIp = 0;

const post = (body: unknown, ip = `10.0.0.${nextIp++}`) =>
	recommend(new Request('https://film.test/api/recommend', { method: 'POST', body: JSON.stringify(body) }), { ip });

describe('recommend function', () => {
	beforeEach(() => {
		vi.stubEnv('GEMINI_API_KEY', 'secret');
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it('returns the recommended films', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => geminiReply({ isMovieRequest: true, recommendations: [{ title: 'Heat', year: 1995 }] }))
		);

		const response = await post({ prompt: 'heist movies' });

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ recommendations: [{ title: 'Heat', year: 1995 }] });
	});

	it('rejects prompts that are not about movies', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => geminiReply({ isMovieRequest: false, recommendations: [] }))
		);

		const response = await post({ prompt: 'capital of France' });

		expect(response.status).toBe(422);
		expect(await response.json()).toEqual({ error: 'notMovies' });
	});

	it('rejects invalid prompts without calling Gemini', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);

		expect((await post({ prompt: '' })).status).toBe(500);
		expect((await post({})).status).toBe(500);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('only accepts POST and needs the API key', async () => {
		const getResponse = await recommend(new Request('https://film.test/api/recommend'), { ip: '1.1.1.1' });
		expect(getResponse.status).toBe(500);

		vi.stubEnv('GEMINI_API_KEY', '');
		expect((await post({ prompt: 'heist movies' })).status).toBe(500);
	});

	it('reports when the Gemini quota is exhausted', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 429 })));

		const response = await post({ prompt: 'heist movies' });

		expect(response.status).toBe(429);
		expect(await response.json()).toEqual({ error: 'quotaExceeded' });
	});

	it('fails cleanly when Gemini breaks', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('oops', { status: 500 })));

		expect((await post({ prompt: 'heist movies' })).status).toBe(500);
	});

	it('limits how often one visitor can ask', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => geminiReply({ isMovieRequest: true, recommendations: [{ title: 'Heat', year: 1995 }] }))
		);

		const statuses = [];
		for (let attempt = 0; attempt < 11; attempt++) statuses.push((await post({ prompt: 'heist movies' }, '9.9.9.9')).status);

		expect(statuses.slice(0, 10).every(status => status === 200)).toBe(true);
		expect(statuses[10]).toBe(429);
	});
});
