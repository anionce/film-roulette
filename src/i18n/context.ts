import { createContext } from 'react';
import type { Language, Translations } from './translations';

export type LanguageContextValue = {
	language: Language;
	toggleLanguage: () => void;
	t: Translations;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
