import React from 'react';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';
import { SelectChangeEvent } from '@mui/material/Select';

export type RuntimeSelectionProps = {
	onDurationChange: (event: SelectChangeEvent<SelectValue>) => void;
};

export const RuntimeSelection = ({ onDurationChange }: RuntimeSelectionProps) => {
	return (
		<div className='home-section-middle'>
			<p className='home-label home-label-middle'>y tengo...</p>
			<Selector selectorValue={SelectValue.Runtime} onChange={onDurationChange} />
		</div>
	);
};
