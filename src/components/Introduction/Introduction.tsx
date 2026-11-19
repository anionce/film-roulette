import { useLanguage } from '../../i18n/useLanguage';

export const Introduction = () => {
	const { t } = useLanguage();

	return (
		<div className='mascot-row'>
			<div className='speech-bubble'>{t.introGreeting}</div>
		</div>
	);
};
