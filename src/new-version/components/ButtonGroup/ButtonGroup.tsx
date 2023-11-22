import React from 'react';
import { FilterButton } from './FilterButton/FilterButton';
import { filterTypes } from '../../../constants/filters';
import { FilterArguments } from '../../pages/Home/Home';
import './ButtonGroup.scss';

export type ButtonGroupProps = {
	filters: FilterArguments;
	openModal: (type: any) => void;
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
