import { Dialog } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { FilterType } from '../../constants/filters';
import CloseIcon from '@mui/icons-material/Close';
import { DefaultModalContent } from './ModalContent/DefaultModalContent';
import { StreamingModalContent } from './ModalContent/StreamingModalContent';
import { StreamingServices } from '../../constants/streamingServices';

export type FiltersModalProps = {
	open: boolean;
	filterType: FilterType;
	closeModal: (filterType: FilterType) => void;
	onSelect:
		| ((event: React.MouseEvent<HTMLButtonElement>) => void)
		| ((event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void);
	filters?: StreamingServices[] | null;
	isButtonDisabled?: boolean;
};

export const FiltersModal = ({
	open,
	filterType,
	closeModal,
	onSelect,
	isButtonDisabled,
	filters,
}: FiltersModalProps) => {
	const shouldShowDefault = filterType === FilterType.Duration || filterType === FilterType.Genre;

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			closeModal(filterType);
		}
	};

	return (
		<Dialog
			classes={{ container: 'dialog-container', paper: 'paper' }}
			fullScreen
			open={open}
			onClose={() => closeModal(filterType)}>
			<div className='selector-container'>
				<div className='filters-exit-button-container'>
					<div className='exit-button' onClick={() => closeModal(filterType)} onKeyDown={handleKeyPress}>
						<CloseIcon />
					</div>
				</div>
				{shouldShowDefault ? (
					<DefaultModalContent
						filterType={filterType}
						onSelect={onSelect as (event: React.MouseEvent<HTMLButtonElement>) => void}
					/>
				) : (
					<StreamingModalContent
						onSelect={onSelect as (event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void}
						filters={filters as StreamingServices[] | null}
						closeModal={closeModal}
						isButtonDisabled={!!isButtonDisabled}
					/>
				)}
			</div>
		</Dialog>
	);
};
