import { ReactElement, ReactNode } from 'react';
import { render as testingRender, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { LanguageProvider } from '../../i18n/LanguageContext';

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<Provider store={store}>
			<LanguageProvider>
				<MemoryRouter>{children}</MemoryRouter>
			</LanguageProvider>
		</Provider>
	);
};

export const customRender = (ui: ReactElement, options?: RenderOptions) =>
	testingRender(ui, { wrapper: Providers, ...options });
