import './ApiError.scss';
import { useLanguage } from '../../i18n/useLanguage';

export type ApiErrorProps = {
	message?: string;
	onRetry: () => void;
};

export const ApiError = ({ message, onRetry }: ApiErrorProps) => {
	const { t } = useLanguage();

	return (
		<div className='api-error-container'>
			<span className='api-error-emoji'>📡</span>
			<span className='api-error-text'>{message ?? t.apiErrorText}</span>
			<button className='api-error-retry-button' onClick={onRetry}>
				{t.retryButton}
			</button>
		</div>
	);
};
