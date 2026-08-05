import { useLanguage } from '../../i18n/LanguageContext';

export const Introduction = () => {
	const { t } = useLanguage();

	return (
		<div className='mascot-row'>
			<div className='mascot'>🍿</div>
			<div className='speech-bubble'>{t.introGreeting}</div>
		</div>
	);
};
