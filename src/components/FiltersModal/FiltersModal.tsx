import { Dialog } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { FilterType } from '../../constants/filters';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { DefaultModalContent } from './ModalContent/DefaultModalContent';
import { StreamingModalContent } from './ModalContent/StreamingModalContent';
import { StreamingServices } from '../../constants/streamingServices';
import { useLanguage } from '../../i18n/LanguageContext';

export type FiltersModalProps = {
	open: boolean;
	filterType: FilterType;
	closeModal: (filterType: FilterType) => void;
	onSelect:
		| ((event: React.MouseEvent<HTMLButtonElement>) => void)
		| ((event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void);
	filters?: StreamingServices[] | null;
	selectedValue?: string | string[] | null;
	isButtonDisabled?: boolean;
};

export const FiltersModal = ({
	open,
	filterType,
	closeModal,
	onSelect,
	isButtonDisabled,
	filters,
	selectedValue,
}: FiltersModalProps) => {
	const { t } = useLanguage();
	const shouldShowDefault = filterType === FilterType.Duration || filterType === FilterType.Genre;
	const isConfirmDisabled = filterType === FilterType.Streaming && !!isButtonDisabled;

	const onConfirmClick = () => {
		if (!isConfirmDisabled) {
			closeModal(filterType);
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			closeModal(filterType);
		}
	};

	const handleConfirmKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			onConfirmClick();
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
					<div
						className='exit-button'
						onClick={() => closeModal(filterType)}
						onKeyDown={handleKeyPress}
						role='button'
						tabIndex={0}
						aria-label={t.closeAriaLabel}>
						<CloseIcon />
					</div>
					<div
						className={`confirm-button ${isConfirmDisabled ? 'confirm-button-disabled' : ''}`}
						onClick={onConfirmClick}
						onKeyDown={handleConfirmKeyPress}
						role='button'
						tabIndex={0}
						aria-label={t.confirmAriaLabel}>
						<CheckIcon />
					</div>
				</div>
				{shouldShowDefault ? (
					<DefaultModalContent
						filterType={filterType}
						selectedValue={selectedValue}
						onSelect={onSelect as (event: React.MouseEvent<HTMLButtonElement>) => void}
					/>
				) : (
					<StreamingModalContent
						onSelect={onSelect as (event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void}
						filters={filters as StreamingServices[] | null}
					/>
				)}
			</div>
		</Dialog>
	);
};
