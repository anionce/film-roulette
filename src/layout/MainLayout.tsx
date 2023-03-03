import React from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
	return (
		<>
			{/* <Header />
			<NavBar /> */}
			<Outlet />
			{/* <Footer /> */}
		</>
	);
};
