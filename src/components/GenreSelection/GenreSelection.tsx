import React, { ChangeEvent } from 'react';
import './GenreSelection.scss';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';
import { MovieGenre } from '../../constants/genre';

export type GenreSelectionProps = {
	onGenreChange: (event: ChangeEvent<HTMLInputElement>) => void;
	genre: MovieGenre | null;
};

export const GenreSelection = ({ onGenreChange, genre }: GenreSelectionProps) => {
	return (
		<div>
			<p className='genre-label'>Hoy me apetece...</p>
			<Selector selectedOption={genre as MovieGenre} selectorValue={SelectValue.Genre} onChange={onGenreChange} />
		</div>
	);
};
