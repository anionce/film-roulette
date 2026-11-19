import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { MovieRoulette } from '../../hooks/useMovieRoulette';
import { StreamingServices } from '../../constants/streamingServices';
import { makeCompleteMovie } from '../../test/factories';
import { renderWithProviders } from '../../test/render';
import { MoviePage } from './MoviePage';

const makeRoulette = (overrides: Partial<MovieRoulette> = {}): MovieRoulette => {
	const movies = [makeCompleteMovie(1, [StreamingServices.Netflix]), makeCompleteMovie(2)];
	return {
		mode: 'filtered',
		status: 'ready',
		movies,
		index: 0,
		emptyReason: 'default',
		isFetchingMore: false,
		isCatalogExhausted: false,
		currentMovie: movies[0],
		hasNext: true,
		showFewResults: false,
		start: vi.fn(),
		next: vi.fn(),
		previous: vi.fn(),
		reset: vi.fn(),
		retry: vi.fn(),
		...overrides,
	};
};

describe('MoviePage', () => {
	it('shows the current movie with its platforms', () => {
		renderWithProviders(<MoviePage roulette={makeRoulette()} />);

		expect(screen.getByText('Movie 1')).toBeInTheDocument();
		expect(screen.getByText('A movie.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Película anterior' })).toBeDisabled();
	});

	it('moves with the buttons and the keyboard', async () => {
		const roulette = makeRoulette();
		const { user } = renderWithProviders(<MoviePage roulette={roulette} />);

		await user.click(screen.getByRole('button', { name: 'Siguiente película' }));
		await user.keyboard('{ArrowRight}{ArrowLeft}');

		expect(roulette.next).toHaveBeenCalledTimes(2);
		expect(roulette.previous).toHaveBeenCalledTimes(1);
	});

	it('does not go forward while more movies are loading', async () => {
		const roulette = makeRoulette({ isFetchingMore: true });
		const { user } = renderWithProviders(<MoviePage roulette={roulette} />);

		await user.keyboard('{ArrowRight}');
		expect(roulette.next).not.toHaveBeenCalled();
	});

	it('resets when leaving', async () => {
		const roulette = makeRoulette();
		const { user } = renderWithProviders(<MoviePage roulette={roulette} />);

		await user.keyboard('{Escape}');
		expect(roulette.reset).toHaveBeenCalled();
	});

	it('shows the loading, empty and error states', async () => {
		const { rerender } = renderWithProviders(
			<MoviePage roulette={makeRoulette({ status: 'loading', currentMovie: undefined })} />
		);
		expect(screen.getByText(/Buscando|Searching|palomitas/i)).toBeInTheDocument();

		rerender(<MoviePage roulette={makeRoulette({ status: 'empty', emptyReason: 'genreCombo' })} />);
		expect(screen.getByText(/combinen esos géneros/)).toBeInTheDocument();

		const roulette = makeRoulette({ status: 'error' });
		rerender(<MoviePage roulette={roulette} />);
		screen.getByRole('button', { name: 'Reintentar' }).click();
		expect(roulette.retry).toHaveBeenCalled();
	});
});
