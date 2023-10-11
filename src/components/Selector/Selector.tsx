import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './Selector.scss';

import { getOptionsForSelector, SelectValue } from '../../constants/selector';

export type SelectorProps = {
	selectorValue: SelectValue;
	onChange: (event: SelectChangeEvent<SelectValue>) => void;
};

export const Selector = ({ selectorValue, onChange }: SelectorProps) => {
	return (
		<Select
			onChange={onChange}
			className=''
			sx={{
				fontFamily: 'Playfair Display',
				width: '500px',
				fontSize: '20px',
				height: '60px',
				padding: '8px',
				borderRadius: '4px',
				border: '1px solid black',
				backgroundColor: 'white',
				'.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' },
			}}>
			{getOptionsForSelector(selectorValue).map(({ text, value }) => (
				<MenuItem key={value} id={value} value={value}>
					{text}
				</MenuItem>
			))}
		</Select>
	);
};
