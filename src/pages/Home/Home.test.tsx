import { useState } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import type { FilterArguments } from '../../constants/filters';
import { EMPTY_FILTERS } from '../../lib/filters';
import { renderWithProviders } from '../../test/render';
import { Home } from './Home';

type HomeWithStateProps = {
	onStart: () => void;
	onRecommend?: (prompt: string) => void;
	onWatchlist?: (username: string) => void;
};

const HomeWithState = ({ onStart, onRecommend = vi.fn(), onWatchlist = vi.fn() }: HomeWithStateProps) => {
	const [filters, setFilters] = useState<FilterArguments>(EMPTY_FILTERS);
	return (
		<Routes>
			<Route
				index
				element={
					<Home
						filters={filters}
						onFiltersChange={setFilters}
						onStart={onStart}
						onRecommend={onRecommend}
						onWatchlist={onWatchlist}
					/>
				}
			/>
			<Route path='/movie' element={<p>Movie page</p>} />
		</Routes>
	);
};

describe('Home', () => {
	it('needs a genre before searching', async () => {
		const onStart = vi.fn();
		const { user } = renderWithProviders(<HomeWithState onStart={onStart} />);

		expect(screen.getByRole('button', { name: 'Buscar película' })).toBeDisabled();

		await user.click(screen.getByRole('button', { name: /Género/ }));
		await user.click(screen.getByRole('button', { name: 'comedia' }));
		await user.click(screen.getByRole('button', { name: 'Aceptar selección' }));

		expect(await screen.findByText('Comedia')).toBeInTheDocument();
		await user.click(await screen.findByRole('button', { name: 'Buscar película' }));

		expect(onStart).toHaveBeenCalledWith('filtered');
		expect(screen.getByText('Movie page')).toBeInTheDocument();
	});

	it('starts a random pick and clears filters', async () => {
		const onStart = vi.fn();
		const { user } = renderWithProviders(<HomeWithState onStart={onStart} />);

		await user.click(screen.getByRole('button', { name: /Duración/ }));
		await user.click(screen.getByRole('button', { name: /~2 h/ }));
		await user.click(screen.getByRole('button', { name: 'Aceptar selección' }));
		await user.click(await screen.findByRole('button', { name: 'Borrar filtros' }));
		expect(screen.queryByRole('button', { name: 'Borrar filtros' })).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Elegir película al azar' }));
		expect(onStart).toHaveBeenCalledWith('random');
	});

	it('sends the described movie to the AI recommender', async () => {
		const onRecommend = vi.fn();
		const { user } = renderWithProviders(<HomeWithState onStart={vi.fn()} onRecommend={onRecommend} />);

		const submit = screen.getByRole('button', { name: 'Recomiéndame' });
		expect(submit).toBeDisabled();

		await user.type(screen.getByLabelText(/cuéntale a la IA/i), '  un thriller corto  ');
		await user.click(submit);

		expect(onRecommend).toHaveBeenCalledWith('un thriller corto');
		expect(screen.getByText('Movie page')).toBeInTheDocument();
	});

	it('picks from a Letterboxd username or a JustWatch link and remembers it', async () => {
		const onWatchlist = vi.fn();
		const { user, unmount } = renderWithProviders(<HomeWithState onStart={vi.fn()} onWatchlist={onWatchlist} />);

		const submit = screen.getByRole('button', { name: 'Elegir' });
		await user.type(screen.getByLabelText(/lista de Letterboxd o JustWatch/i), 'bad name!');
		expect(submit).toBeDisabled();

		await user.clear(screen.getByLabelText(/lista de Letterboxd o JustWatch/i));
		await user.type(screen.getByLabelText(/lista de Letterboxd o JustWatch/i), 'dave');
		await user.click(submit);

		expect(onWatchlist).toHaveBeenCalledWith('dave');
		expect(screen.getByText('Movie page')).toBeInTheDocument();

		unmount();
		renderWithProviders(<HomeWithState onStart={vi.fn()} />);
		expect(screen.getByLabelText(/lista de Letterboxd o JustWatch/i)).toHaveValue('dave');
	});

	it('accepts a shared JustWatch link as it is', async () => {
		const onWatchlist = vi.fn();
		const { user } = renderWithProviders(<HomeWithState onStart={vi.fn()} onWatchlist={onWatchlist} />);
		const link = 'https://www.justwatch.com/shared?id=tl-us-bd94f102-aef1-4887-b110-bb2674662683';

		await user.click(screen.getByLabelText(/lista de Letterboxd o JustWatch/i));
		await user.paste(link);
		await user.click(screen.getByRole('button', { name: 'Elegir' }));

		expect(onWatchlist).toHaveBeenCalledWith(link);
	});

	it('only confirms platforms once one is selected', async () => {
		const { user } = renderWithProviders(<HomeWithState onStart={vi.fn()} />);

		await user.click(screen.getByRole('button', { name: /Plataformas/ }));
		expect(screen.getByRole('button', { name: 'Aceptar selección' })).toBeDisabled();

		await user.click(screen.getByRole('button', { name: 'Netflix' }));
		expect(screen.getByRole('button', { name: 'Aceptar selección' })).toBeEnabled();
	});
});
