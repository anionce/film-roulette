import React from 'react';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';
import { SelectChangeEvent } from '@mui/material/Select';

export type GenreSelectionProps = {
	onMainGenreChange: (event: SelectChangeEvent<SelectValue>) => void;
};

export const GenreSelection = ({ onMainGenreChange }: GenreSelectionProps) => {
	return (
		<div className='home-section-top'>
			<p className='home-label'>Hoy me apetece...</p>
			<Selector selectorValue={SelectValue.Genre} onChange={onMainGenreChange} />
		</div>
	);
};
