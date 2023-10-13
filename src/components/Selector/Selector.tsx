import React from 'react';
import './Selector.scss';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getOptionsForSelector, SelectValue } from '../../constants/selector';

export type SelectorProps = {
	selectorValue: SelectValue;
	onChange: (event: SelectChangeEvent<SelectValue>) => void;
};

export const Selector = ({ selectorValue, onChange }: SelectorProps) => {
	return (
		<Select onChange={onChange} classes={{ root: 'root-element', select: 'select-element' }}>
			{getOptionsForSelector(selectorValue).map(({ text, value }) => (
				<MenuItem
					sx={{ minHeight: 35, fontFamily: 'Playfair Display', fontSize: 20 }}
					classes={{ root: 'menu-item' }}
					key={value}
					id={value}
					value={value}>
					{text}
				</MenuItem>
			))}
		</Select>
	);
};
