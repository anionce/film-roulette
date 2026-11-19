import { describe, expect, it } from 'vitest';
import { getLastYearRange, mapValueToEraRange, MovieEra } from './era';

describe('era ranges', () => {
	it('computes the last year with local dates', () => {
		expect(getLastYearRange(new Date(2026, 0, 1, 0, 30))).toEqual({ gte: '2025-01-01', lte: '2026-01-01' });
	});

	it('maps fixed eras and no era', () => {
		expect(mapValueToEraRange(MovieEra.Decade80)).toEqual({ gte: '1980-01-01', lte: '1989-12-31' });
		expect(mapValueToEraRange(null)).toBeNull();
	});
});
