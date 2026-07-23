import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language, Translations } from './translations';

export type LanguageContextValue = {
	language: Language;
	toggleLanguage: () => void;
	t: Translations;
};

const LANGUAGE_STORAGE_KEY = 'film-roulette-language';

const getInitialLanguage = (): Language => {
	return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'es';
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguage] = useState<Language>(getInitialLanguage);

	const toggleLanguage = () => {
		setLanguage(prev => {
			const next: Language = prev === 'es' ? 'en' : 'es';
			window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
			return next;
		});
	};

	return (
		<LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = (): LanguageContextValue => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};
