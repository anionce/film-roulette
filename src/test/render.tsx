import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageProvider';

const Providers = ({ children }: { children: ReactNode }) => (
	<LanguageProvider>
		<MemoryRouter>{children}</MemoryRouter>
	</LanguageProvider>
);

export const renderWithProviders = (ui: ReactElement) => ({ user: userEvent.setup(), ...render(ui, { wrapper: Providers }) });
