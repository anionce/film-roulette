import { Stack } from '@mui/material';
import React from 'react';
import { getOptionsForSelector } from '../../../constants/selector';
import { FilterType } from '../../../constants/filters';
import '../FiltersModal.scss';

export type DefaultModalContentProps = {
	onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
	filterType: FilterType;
};

export const DefaultModalContent = ({ onSelect, filterType }: DefaultModalContentProps) => {
	const GENRE_TITLE = 'Elige el género que prefieras:';
	const DURATION_TITLE = 'Selecciona cuánto tiempo tienes:';
	return (
		<div className='modal-content-container'>
			<p>{filterType === FilterType.Genre ? GENRE_TITLE : DURATION_TITLE}</p>
			<Stack spacing={{ xs: 1.5, sm: 3 }} direction='row' justifyContent='center' useFlexGap flexWrap='wrap'>
				{getOptionsForSelector(filterType).map(({ text, value }) => (
					<button onClick={onSelect} data-value={value} key={value} className='selection-button'>
						<div className='filter-button-content'>{text}</div>
					</button>
				))}
			</Stack>
		</div>
	);
};
