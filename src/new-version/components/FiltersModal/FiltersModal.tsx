import { Dialog } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { FilterType } from '../../../constants/filters';
import CloseIcon from '@mui/icons-material/Close';
import { DefaultModalContent } from './ModalContent/DefaultModalContent';
import { StreamingModalContent } from './ModalContent/StreamingModalContent';

export type FiltersModalProps = {
	open: boolean;
	filterType: FilterType;
	closeModal: (filterType: FilterType) => void;
	onSelect:
		| ((event: React.MouseEvent<HTMLButtonElement>) => void)
		| ((event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void);
	filters?: any;
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

	return (
		<Dialog
			classes={{ container: 'dialog-container', paper: 'paper' }}
			fullScreen
			open={open}
			onClose={() => closeModal(filterType)}>
			<div className='selector-container'>
				<div className='exit-button' onClick={() => closeModal(filterType)}>
					<CloseIcon />
				</div>
				{shouldShowDefault ? (
					<DefaultModalContent
						filterType={filterType}
						onSelect={onSelect as (event: React.MouseEvent<HTMLButtonElement>) => void}
					/>
				) : (
					<StreamingModalContent
						onSelect={onSelect as (event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void}
						filters={filters}
						closeModal={closeModal}
						isButtonDisabled={!!isButtonDisabled}
					/>
				)}
			</div>
		</Dialog>
	);
};
