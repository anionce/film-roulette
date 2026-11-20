import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rateLimiter';

describe('createRateLimiter', () => {
	it('allows requests up to the limit and then blocks', () => {
		const isRateLimited = createRateLimiter(2, 1000);

		expect(isRateLimited('a', 0)).toBe(false);
		expect(isRateLimited('a', 100)).toBe(false);
		expect(isRateLimited('a', 200)).toBe(true);
	});

	it('tracks each key separately', () => {
		const isRateLimited = createRateLimiter(1, 1000);

		expect(isRateLimited('a', 0)).toBe(false);
		expect(isRateLimited('b', 0)).toBe(false);
		expect(isRateLimited('a', 1)).toBe(true);
	});

	it('allows requests again once the window has passed', () => {
		const isRateLimited = createRateLimiter(1, 1000);

		isRateLimited('a', 0);
		expect(isRateLimited('a', 500)).toBe(true);
		expect(isRateLimited('a', 1500)).toBe(false);
	});
});
