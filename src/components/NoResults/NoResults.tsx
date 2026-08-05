import './NoResults.scss';
import { useLanguage } from '../../i18n/LanguageContext';

export type NoResultsProps = {
	message?: string;
	onGoHome: () => void;
};

export const NoResults = ({ message, onGoHome }: NoResultsProps) => {
	const { t } = useLanguage();

	return (
		<div className='no-results-container'>
			<div className='no-results-mascot'>🍿</div>
			<p className='no-results-title'>{t.noResultsTitle}</p>
			<p className='no-results-text'>{message ?? t.noResultsDefaultMessage}</p>
			<button className='no-results-button' onClick={onGoHome}>
				{t.goHomeButton}
			</button>
		</div>
	);
};
