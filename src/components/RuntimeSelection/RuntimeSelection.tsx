import React from 'react';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';
import { SelectChangeEvent } from '@mui/material/Select';
import { MovieRuntime } from '../../constants/runtime';

export type RuntimeSelectionProps = {
	onDurationChange: (event: SelectChangeEvent<MovieRuntime>) => void;
	duration: MovieRuntime;
};

export const RuntimeSelection = ({ onDurationChange, duration }: RuntimeSelectionProps) => {
	return (
		<div className='home-section-middle'>
			<p className='home-label home-label-middle'>y tengo...</p>
			<Selector selectedOption={duration} selectorValue={SelectValue.Runtime} onChange={onDurationChange} />
		</div>
	);
};
