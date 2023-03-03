import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../../assets/locales/en.json';

const resources = {
	en: {
		translation: translationEN,
	},
};

i18n.use(initReactI18next).init({
	debug: false,
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
	resources,
});

export default i18n;
