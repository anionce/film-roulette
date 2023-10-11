import React from 'react';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';

export type GenreSelectionProps = {
	onMainGenreChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const GenreSelection = ({ onMainGenreChange }: GenreSelectionProps) => {
	return (
		<div className='home-section-top'>
			<p className='home-label'>Today, I want...</p>
			<Selector selectorValue={SelectValue.Genre} onChange={onMainGenreChange} />
		</div>
	);
};
