import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import type { StartMode } from '../../hooks/useMovieRoulette';
import { useLanguage } from '../../i18n/useLanguage';
import './StartButton.scss';

type StartButtonProps = {
	mode: StartMode;
	disabled: boolean;
	onStart: (mode: StartMode) => void;
};

export const StartButton = ({ mode, disabled, onStart }: StartButtonProps) => {
	const { t } = useLanguage();
	const isRandom = mode === 'random';

	return (
		<div className='start-button-container'>
			<button
				type='button'
				disabled={disabled}
				onClick={() => onStart(mode)}
				aria-label={isRandom ? t.randomAriaLabel : t.searchAriaLabel}
				className={`start-button ${isRandom ? 'start-button-random' : ''}`}
			>
				{isRandom ? <ShuffleIcon htmlColor='#fff' /> : <PlayCircleIcon htmlColor='#fff' />}
				<span>{isRandom ? t.randomButton : t.searchButton}</span>
			</button>
		</div>
	);
};
