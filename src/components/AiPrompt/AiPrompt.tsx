import { useState, type FormEvent } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLanguage } from '../../i18n/useLanguage';
import { MAX_PROMPT_LENGTH } from '../../models/Recommendation';
import './AiPrompt.scss';

type AiPromptProps = {
	onSubmit: (prompt: string) => void;
};

export const AiPrompt = ({ onSubmit }: AiPromptProps) => {
	const { t } = useLanguage();
	const [prompt, setPrompt] = useState('');
	const trimmedPrompt = prompt.trim();

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (trimmedPrompt) onSubmit(trimmedPrompt);
	};

	return (
		<form className='ai-prompt' onSubmit={handleSubmit}>
			<label className='ai-prompt-label' htmlFor='ai-prompt-input'>
				<AutoAwesomeIcon fontSize='small' />
				{t.aiPromptLabel}
			</label>
			<div className='ai-prompt-row'>
				<input
					id='ai-prompt-input'
					className='ai-prompt-input'
					value={prompt}
					maxLength={MAX_PROMPT_LENGTH}
					placeholder={t.aiPromptPlaceholder}
					onChange={event => setPrompt(event.target.value)}
				/>
				<button type='submit' className='ai-prompt-button' disabled={!trimmedPrompt}>
					{t.aiPromptButton}
				</button>
			</div>
		</form>
	);
};
