import { render as testingRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

const Providers = ({ children }) => {
	return (
		<Provider store={store}>
			<MemoryRouter>{children}</MemoryRouter>
		</Provider>
	);
};

export const customRender = (ui, options) => testingRender(ui, { wrapper: Providers, ...options });
