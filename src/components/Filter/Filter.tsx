import React from 'react';
import { ChangeEvent } from 'react';
import './Filter.scss';

type filterProps = {
	onTypeChanged: (event: ChangeEvent<HTMLSelectElement>) => void;
	typeSelected?: string;
	defaultOption?: string;
};

export const Filter = ({ onTypeChanged, typeSelected, defaultOption }: filterProps) => {
	return (
		<div className='select-container'>
			<label htmlFor='filter'>""</label>
			<select id='filter' onChange={onTypeChanged} defaultValue={''}>
				<option value={defaultOption}>{defaultOption}</option>
				{/* {'options'.map((option: any) => (
					<option key={option} value={option}>
						{option}
					</option>
				))} */}
			</select>
		</div>
	);
};
