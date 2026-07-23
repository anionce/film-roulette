import { render as testingRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { LanguageProvider } from '../../i18n/LanguageContext';

const Providers = ({ children }) => {
	return (
		<Provider store={store}>
			<LanguageProvider>
				<MemoryRouter>{children}</MemoryRouter>
			</LanguageProvider>
		</Provider>
	);
};

export const customRender = (ui, options) => testingRender(ui, { wrapper: Providers, ...options });
