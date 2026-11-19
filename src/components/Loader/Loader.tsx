import './Loader.scss';
import { useLanguage } from '../../i18n/useLanguage';

export const Loader = () => {
	const { t } = useLanguage();

	return (
		<div className='loader-container'>
			<div className='loader-mascot'>🍿</div>
			<p className='loader-text'>{t.loaderText}</p>
		</div>
	);
};
