import { Stack } from '@mui/material';
import React from 'react';
import { getOptionsForSelector } from '../../../../constants/selector';
import { FilterType } from '../../../../constants/filters';
import '../FiltersModal.scss';

export type DefaultModalContentProps = {
	onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
	filterType: FilterType;
};

export const DefaultModalContent = ({ onSelect, filterType }: DefaultModalContentProps) => {
	return (
		<Stack spacing={{ xs: 1, sm: 3 }} direction='row' justifyContent='center' useFlexGap flexWrap='wrap'>
			{getOptionsForSelector(filterType).map(({ text, value }) => (
				<button onClick={onSelect} data-value={text} key={value} className='selection-button'>
					<div className='filter-button-content'>{text}</div>
				</button>
			))}
		</Stack>
	);
};
