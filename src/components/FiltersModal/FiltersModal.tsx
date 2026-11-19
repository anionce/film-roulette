import { Dialog } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { FilterType, type FilterArguments } from '../../constants/filters';
import type { MovieEra } from '../../constants/era';
import type { MovieGenre } from '../../constants/genre';
import type { MovieRuntime } from '../../constants/runtime';
import { useLanguage } from '../../i18n/useLanguage';
import { hasSelection, toggleGenre } from '../../lib/filters';
import { DefaultModalContent } from './ModalContent/DefaultModalContent';
import { StreamingModalContent } from './ModalContent/StreamingModalContent';
import './FiltersModal.scss';

type FiltersModalProps = {
	open: boolean;
	filterType: FilterType;
	filters: FilterArguments;
	onChange: (filters: FilterArguments) => void;
	onClose: () => void;
};

const selectedValuesOf = (filters: FilterArguments, type: FilterType): string[] => {
	const value = filters[type];
	return Array.isArray(value) ? value : value ? [value] : [];
};

export const FiltersModal = ({ open, filterType, filters, onChange, onClose }: FiltersModalProps) => {
	const { t } = useLanguage();
	const isStreaming = filterType === FilterType.Streaming;
	const isConfirmDisabled = isStreaming && !hasSelection(filters, FilterType.Streaming);

	const select = (value: string) => {
		if (filterType === FilterType.Genre) onChange(toggleGenre(filters, value as MovieGenre));
		if (filterType === FilterType.Duration) onChange({ ...filters, duration: value as MovieRuntime });
		if (filterType === FilterType.Era) onChange({ ...filters, era: value as MovieEra });
	};

	return (
		<Dialog classes={{ container: 'dialog-container', paper: 'paper' }} fullScreen open={open} onClose={onClose}>
			<div className='selector-container'>
				<div className='filters-exit-button-container'>
					<button type='button' className='exit-button' onClick={onClose} aria-label={t.closeAriaLabel}>
						<CloseIcon />
					</button>
					<button
						type='button'
						className={`confirm-button ${isConfirmDisabled ? 'confirm-button-disabled' : ''}`}
						onClick={onClose}
						disabled={isConfirmDisabled}
						aria-label={t.confirmAriaLabel}
					>
						<CheckIcon />
					</button>
					{hasSelection(filters, filterType) && (
						<button
							className='modal-clear-button'
							onClick={() => onChange({ ...filters, [filterType]: null })}
							type='button'
						>
							{t.clearSelectionButton}
						</button>
					)}
				</div>
				{isStreaming ? (
					<StreamingModalContent
						selected={filters.streaming ?? []}
						onChange={streaming => onChange({ ...filters, streaming })}
					/>
				) : (
					<DefaultModalContent
						filterType={filterType}
						selectedValues={selectedValuesOf(filters, filterType)}
						onSelect={select}
					/>
				)}
			</div>
		</Dialog>
	);
};
