import React from 'react';
import './LanguageToggle.scss';
import { useLanguage } from '../../i18n/LanguageContext';

export const LanguageToggle = () => {
	const { language, toggleLanguage, t } = useLanguage();

	return (
		<button className='language-toggle' onClick={toggleLanguage} aria-label={t.languageToggleAriaLabel}>
			{language === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
		</button>
	);
};
