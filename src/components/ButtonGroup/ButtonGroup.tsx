import { filterTypes, type FilterArguments, type FilterType } from '../../constants/filters';
import { FilterButton } from './FilterButton/FilterButton';
import './ButtonGroup.scss';

type ButtonGroupProps = {
	filters: FilterArguments;
	openModal: (type: FilterType) => void;
};

export const ButtonGroup = ({ filters, openModal }: ButtonGroupProps) => (
	<div className='filter-buttons-container'>
		{filterTypes.map(filterType => (
			<FilterButton key={filterType} filters={filters} filterType={filterType} openModal={openModal} />
		))}
	</div>
);
