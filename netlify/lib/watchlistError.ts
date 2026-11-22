import type { WatchlistErrorKind } from '../../src/models/Watchlist';

export class WatchlistError extends Error {
	readonly kind: WatchlistErrorKind;

	constructor(kind: WatchlistErrorKind) {
		super(`Watchlist request failed: ${kind}`);
		this.kind = kind;
	}
}
