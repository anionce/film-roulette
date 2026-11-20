export const createRateLimiter = (limit: number, windowMs: number) => {
	const hitsByKey = new Map<string, number[]>();

	return (key: string, now = Date.now()): boolean => {
		const recentHits = (hitsByKey.get(key) ?? []).filter(hit => now - hit < windowMs);
		const isLimited = recentHits.length >= limit;
		hitsByKey.set(key, isLimited ? recentHits : [...recentHits, now]);
		return isLimited;
	};
};
