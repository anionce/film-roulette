import { MenuItem, Select } from '@mui/material';
import React from 'react';
import '../../pages/Home/HomeMobile.scss';
import { getOptionsForSelector } from '../../../constants/selector';

export type SelectorMobileProps = {
	selectorType: any;
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
