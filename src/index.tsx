import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { App } from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import './index.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<LanguageProvider>
				<App />
			</LanguageProvider>
		</Provider>
	</React.StrictMode>
);
