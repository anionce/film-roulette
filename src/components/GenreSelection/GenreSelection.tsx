import React from 'react';
import './GenreSelection.scss';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';
import { SelectChangeEvent } from '@mui/material/Select';
import { MovieGenre } from '../../constants/genre';

export type GenreSelectionProps = {
	onMainGenreChange: (event: SelectChangeEvent<MovieGenre>) => void;
	genre: MovieGenre;
};

export const GenreSelection = ({ onMainGenreChange, genre }: GenreSelectionProps) => {
	return (
		<div>
			<p className='genre-label'>Hoy me apetece...</p>
			<Selector selectedOption={genre} selectorValue={SelectValue.Genre} onChange={onMainGenreChange} />
		</div>
	);
};
