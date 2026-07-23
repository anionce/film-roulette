import React from 'react';
import './ApiError.scss';
import { useLanguage } from '../../i18n/LanguageContext';

export type ApiErrorProps = {
	onRetry: () => void;
};

export const ApiError = ({ onRetry }: ApiErrorProps) => {
	const { t } = useLanguage();

	return (
		<div className='api-error-container'>
			<span className='api-error-emoji'>📡</span>
			<span className='api-error-text'>{t.apiErrorText}</span>
			<button className='api-error-retry-button' onClick={onRetry}>
				{t.retryButton}
			</button>
		</div>
	);
};
