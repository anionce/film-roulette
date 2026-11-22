import { useState, type FormEvent } from 'react';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import { useLanguage } from '../../i18n/useLanguage';
import { parseWatchlistSource } from '../../lib/watchlistSource';
import './WatchlistForm.scss';

const LIST_STORAGE_KEY = 'film-roulette-watchlist-source';

type WatchlistFormProps = {
	onSubmit: (input: string) => void;
};

export const WatchlistForm = ({ onSubmit }: WatchlistFormProps) => {
	const { t } = useLanguage();
	const [input, setInput] = useState(() => localStorage.getItem(LIST_STORAGE_KEY) ?? '');
	const trimmedInput = input.trim();
	const isValid = parseWatchlistSource(trimmedInput) !== null;

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (!isValid) return;
		localStorage.setItem(LIST_STORAGE_KEY, trimmedInput);
		onSubmit(trimmedInput);
	};

	return (
		<form className='watchlist-form' onSubmit={handleSubmit}>
			<label className='watchlist-form-label' htmlFor='watchlist-form-input'>
				<MovieFilterIcon fontSize='small' />
				{t.watchlistLabel}
			</label>
			<div className='watchlist-form-row'>
				<input
					id='watchlist-form-input'
					className='watchlist-form-input'
					value={input}
					placeholder={t.watchlistPlaceholder}
					autoCapitalize='none'
					autoCorrect='off'
					spellCheck={false}
					onChange={event => setInput(event.target.value)}
				/>
				<button type='submit' className='watchlist-form-button' disabled={!isValid}>
					{t.watchlistButton}
				</button>
			</div>
			<p className='watchlist-form-hint'>{t.watchlistHint}</p>
		</form>
	);
};
