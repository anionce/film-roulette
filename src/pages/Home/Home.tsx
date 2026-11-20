import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiPrompt } from '../../components/AiPrompt/AiPrompt';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { FiltersModal } from '../../components/FiltersModal/FiltersModal';
import { Header } from '../../components/Header/Header';
import { Introduction } from '../../components/Introduction/Introduction';
import { LanguageToggle } from '../../components/LanguageToggle/LanguageToggle';
import { StartButton } from '../../components/StartButton/StartButton';
import { type FilterType, filterTypes, type FilterArguments } from '../../constants/filters';
import type { StartMode } from '../../hooks/useMovieRoulette';
import { useLanguage } from '../../i18n/useLanguage';
import { canPickRandom, canSearch, EMPTY_FILTERS, hasAnyFilter } from '../../lib/filters';
import './Home.scss';

type HomeProps = {
	filters: FilterArguments;
	onFiltersChange: (filters: FilterArguments) => void;
	onStart: (mode: StartMode) => void;
	onRecommend: (prompt: string) => void;
};

export const Home = ({ filters, onFiltersChange, onStart, onRecommend }: HomeProps) => {
	const { t } = useLanguage();
	const navigate = useNavigate();
	const [openFilter, setOpenFilter] = useState<FilterType | null>(null);

	const start = (mode: StartMode) => {
		onStart(mode);
		navigate('/movie');
	};

	const recommend = (prompt: string) => {
		onRecommend(prompt);
		navigate('/movie');
	};

	return (
		<div className='home-mobile-container'>
			<div className='home-top-bar'>
				<LanguageToggle />
			</div>
			<Header />
			<Introduction />
			<ButtonGroup filters={filters} openModal={setOpenFilter} />
			{hasAnyFilter(filters) && (
				<button className='clear-filters-button' onClick={() => onFiltersChange(EMPTY_FILTERS)} type='button'>
					{t.clearFiltersButton}
				</button>
			)}
			<div className='action-button-container'>
				<StartButton mode='filtered' disabled={!canSearch(filters)} onStart={start} />
				<StartButton mode='random' disabled={!canPickRandom(filters)} onStart={start} />
			</div>
			<AiPrompt onSubmit={recommend} />
			{filterTypes.map(type => (
				<FiltersModal
					key={type}
					open={openFilter === type}
					filterType={type}
					filters={filters}
					onChange={onFiltersChange}
					onClose={() => setOpenFilter(null)}
				/>
			))}
		</div>
	);
};
