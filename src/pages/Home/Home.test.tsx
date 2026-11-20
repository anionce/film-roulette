import { useState } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import type { FilterArguments } from '../../constants/filters';
import { EMPTY_FILTERS } from '../../lib/filters';
import { renderWithProviders } from '../../test/render';
import { Home } from './Home';

const HomeWithState = ({ onStart, onRecommend = vi.fn() }: { onStart: () => void; onRecommend?: (prompt: string) => void }) => {
	const [filters, setFilters] = useState<FilterArguments>(EMPTY_FILTERS);
	return (
		<Routes>
			<Route
				index
				element={<Home filters={filters} onFiltersChange={setFilters} onStart={onStart} onRecommend={onRecommend} />}
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

	it('only confirms platforms once one is selected', async () => {
		const { user } = renderWithProviders(<HomeWithState onStart={vi.fn()} />);

		await user.click(screen.getByRole('button', { name: /Plataformas/ }));
		expect(screen.getByRole('button', { name: 'Aceptar selección' })).toBeDisabled();

		await user.click(screen.getByRole('button', { name: 'Netflix' }));
		expect(screen.getByRole('button', { name: 'Aceptar selección' })).toBeEnabled();
	});
});
