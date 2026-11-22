import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { FilterArguments } from './constants/filters';
import { useMovieRoulette } from './hooks/useMovieRoulette';
import { EMPTY_FILTERS } from './lib/filters';
import { Home } from './pages/Home/Home';
import { MoviePage } from './pages/MoviePage/MoviePage';
import { NotFound } from './pages/NotFound/NotFound';

export const App = () => {
	const [filters, setFilters] = useState<FilterArguments>(EMPTY_FILTERS);
	const roulette = useMovieRoulette();

	return (
		<BrowserRouter>
			<Routes>
				<Route
					index
					element={
						<Home
							filters={filters}
							onFiltersChange={setFilters}
							onStart={mode => roulette.start(mode, filters)}
							onRecommend={roulette.recommend}
							onWatchlist={username => roulette.startWatchlist(username, filters)}
						/>
					}
				/>
				<Route path='/movie' element={roulette.mode ? <MoviePage roulette={roulette} /> : <Navigate to='/' replace />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};
