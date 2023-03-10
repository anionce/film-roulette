import React from 'react';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';

export type RuntimeSelectionProps = {
	onDurationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const RuntimeSelection = ({ onDurationChange }: RuntimeSelectionProps) => {
	return (
		<div className='home-section-middle'>
			<p className='home-label home-label-middle'>and i have...</p>
			<Selector selectorValue={SelectValue.Runtime} onChange={onDurationChange} />
		</div>
	);
};
