import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { NotFound } from './pages/NotFound/NotFound';
import './App.scss';
import React from 'react';
import { Home } from './pages/Home/Home';

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</Router>
	);
};
