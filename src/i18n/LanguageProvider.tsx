import { useState, type ReactNode } from 'react';
import { LanguageContext } from './context';
import { translations, type Language } from './translations';

const LANGUAGE_STORAGE_KEY = 'film-roulette-language';

const storedLanguage = (): Language => (localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'es');

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguage] = useState<Language>(storedLanguage);

	const toggleLanguage = () => {
		const next: Language = language === 'es' ? 'en' : 'es';
		localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
		setLanguage(next);
	};

	return <LanguageContext value={{ language, toggleLanguage, t: translations[language] }}>{children}</LanguageContext>;
};
