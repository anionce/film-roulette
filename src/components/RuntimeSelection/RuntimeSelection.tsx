import React, { ChangeEvent } from 'react';
import './RuntimeSelection.scss';
import { SelectValue } from '../../constants/selector';
import { Selector } from '../Selector/Selector';
import '../../pages/Home/Home.scss';
import { MovieRuntime } from '../../constants/runtime';

export type RuntimeSelectionProps = {
	onDurationChange: (event: ChangeEvent<HTMLInputElement>) => void;
	duration: MovieRuntime | null;
};

export const RuntimeSelection = ({ onDurationChange, duration }: RuntimeSelectionProps) => {
	return (
		<div>
			<p className='duration-label'>y tengo...</p>
			<Selector
				selectedOption={duration as MovieRuntime}
				selectorValue={SelectValue.Runtime}
				onChange={onDurationChange}
			/>
		</div>
	);
};
