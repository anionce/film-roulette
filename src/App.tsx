import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { NotFound } from './pages/NotFound/NotFound';
import './App.scss';
import React from 'react';

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route element={<MainLayout />}>
					{/* 	<Route index element={<Home />} />
					<Route path='sample' element={<Sample />} /> */}
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</Router>
	);
};
