import { useLanguage } from '../../i18n/LanguageContext';
import './Header.scss';

export const Header = () => {
	const { t } = useLanguage();

	return (
		<div className='app-header'>
			<div className='app-header-icon'>🍿</div>
			<div className='app-header-text'>
				<p className='app-header-title'>{t.appName}</p>
				<p className='app-header-tagline'>{t.appTagline}</p>
			</div>
		</div>
	);
};
