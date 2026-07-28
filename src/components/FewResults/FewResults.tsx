import React from 'react';
import './FewResults.scss';
import { useLanguage } from '../../i18n/LanguageContext';

export const FewResults = () => {
	const { t } = useLanguage();

	return (
		<div className='few-results-container'>
			<div className='few-results-badge'>
				<span className='few-results-emoji'>🔍</span>
				<span className='few-results-text'>{t.fewResultsText}</span>
			</div>
		</div>
	);
};
