import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LanguageProvider } from './i18n/LanguageProvider';
import './index.scss';

const root = document.getElementById('root');

if (root) {
	createRoot(root).render(
		<StrictMode>
			<LanguageProvider>
				<App />
			</LanguageProvider>
		</StrictMode>
	);
}
