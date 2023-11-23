import React from 'react';
import { FilterButton } from './FilterButton/FilterButton';
import { FilterArguments, FilterType, filterTypes } from '../../constants/filters';
import './ButtonGroup.scss';

export type ButtonGroupProps = {
	filters: FilterArguments;
	openModal: (type: FilterType) => void;
};

export const ButtonGroup = ({ filters, openModal }: ButtonGroupProps) => {
	return (
		<div className='filter-buttons-container'>
			{filterTypes.map(filter => {
				return <FilterButton key={filter} filters={filters} openModal={openModal} filterType={filter} />;
			})}
		</div>
	);
};
