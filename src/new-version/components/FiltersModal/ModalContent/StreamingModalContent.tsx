import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { StreamingServices, streamingServices } from '../../../../constants/streamingServices';
import { FilterType } from '../../../../constants/filters';
import '../FiltersModal.scss';

export type StreamingModalContentProps = {
	onSelect: (event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void;
	filters: StreamingServices[];
	closeModal: any;
	isButtonDisabled: boolean;
};

export const StreamingModalContent = ({
	onSelect,
	filters,
	isButtonDisabled,
	closeModal,
}: StreamingModalContentProps) => {
	return (
		<div className='streaming-modal-container'>
			<ToggleButtonGroup className='toggle-group' value={filters} onChange={onSelect as any} size='small'>
				{streamingServices.map(streamingService => (
					<ToggleButton
						disableRipple
						sx={{
							backgroundColor: 'transparent',
							border: 'none',
							'&.Mui-selected': {
								backgroundColor: 'transparent',
								'& .mobile-streaming-logo': {
									opacity: 1,
								},
								'&:hover': { backgroundColor: 'transparent' },
							},
							'&:hover': { backgroundColor: 'transparent' },
						}}
						key={streamingService.name}
						value={streamingService.name}
						aria-label={streamingService.name}>
						<img
							className='mobile-streaming-logo'
							alt={streamingService.name}
							src={streamingService.logo}
						/>
					</ToggleButton>
				))}
			</ToggleButtonGroup>
			<button
				onClick={() => !isButtonDisabled && closeModal(FilterType.Streaming)}
				className={`streaming-button-continue ${isButtonDisabled && 'streaming-button-disabled'}`}>
				Continuar
			</button>
		</div>
	);
};
