import React from 'react';
import { getOptionsForSelector, SelectValue } from '../../constants/selector';

export type SelectorProps = {
	selectorValue: SelectValue;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Selector = ({ selectorValue, onChange }: SelectorProps) => {
	return (
		<select onChange={onChange}>
			{getOptionsForSelector(selectorValue).map(({ text, value }) => (
				<option key={value} id={value} value={value}>
					{text}
				</option>
			))}
		</select>
	);
};
