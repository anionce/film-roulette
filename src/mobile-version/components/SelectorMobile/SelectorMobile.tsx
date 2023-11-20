import { MenuItem, Select } from '@mui/material';
import React from 'react';
import '../../pages/HomeMobile/HomeMobile.scss';
import { SelectValue, getOptionsForSelector } from '../../../constants/selector';

export type SelectorMobileProps = {
	selectorType: SelectValue;
};

export const SelectorMobile = ({ selectorType }: SelectorMobileProps) => {
	return (
		<Select classes={{ root: 'filter-button duration-button' }}>
			{getOptionsForSelector(selectorType).map(({ text, value }) => (
				<MenuItem classes={{ root: 'filter-button' }} key={value} data-testid={value}>
					{text}
				</MenuItem>
			))}
		</Select>
	);
};
