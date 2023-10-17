import React from 'react';
import './Selector.scss';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getOptionsForSelector, SelectValue } from '../../constants/selector';
import { MovieRuntime } from '../../constants/runtime';
import { MovieGenre } from '../../constants/genre';

export type SelectorProps = {
	selectorValue: SelectValue;
	onChange: (event: SelectChangeEvent<MovieGenre | MovieRuntime>) => void;
	selectedOption: MovieGenre | MovieRuntime;
};

export const Selector = ({ selectorValue, onChange, selectedOption }: SelectorProps) => {
	return (
		<Select value={selectedOption} onChange={onChange} classes={{ root: 'root-element' }}>
			{getOptionsForSelector(selectorValue).map(({ text, value }) => (
				<MenuItem
					sx={{ minHeight: 35, fontFamily: 'Playfair Display', fontSize: 20 }}
					classes={{ root: 'menu-item' }}
					key={value}
					data-testid={value}
					value={value}>
					{text}
				</MenuItem>
			))}
		</Select>
	);
};
