import { render as testingRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../services/i18n';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

const Providers = ({ children }) => {
	return (
		<Provider store={store}>
			<MemoryRouter>
				<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
			</MemoryRouter>
		</Provider>
	);
};

export const customRender = (ui, options) => testingRender(ui, { wrapper: Providers, ...options });
