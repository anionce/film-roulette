import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { StreamingServices, streamingServices } from '../../../constants/streamingServices';
import { useLanguage } from '../../../i18n/LanguageContext';
import '../FiltersModal.scss';

export type StreamingModalContentProps = {
	onSelect: (event: ChangeEvent<HTMLInputElement>, newServices: string[]) => void;
	filters: StreamingServices[] | null;
};

export const StreamingModalContent = ({ onSelect, filters }: StreamingModalContentProps) => {
	const { t } = useLanguage();

	return (
		<div className='streaming-modal-container'>
			<p>{t.streamingModalTitle}</p>
			<ToggleButtonGroup className='toggle-group' value={filters} onChange={onSelect as any} size='small'>
				{streamingServices.map(streamingService => (
					<ToggleButton
						disableRipple
						className='platform-toggle'
						sx={{
							backgroundColor: 'transparent',
							border: 'none',
							padding: 0,
							'&.Mui-selected': {
								backgroundColor: 'transparent',
								'&:hover': { backgroundColor: 'transparent' },
							},
							'&:hover': { backgroundColor: 'transparent' },
						}}
						key={streamingService.name}
						value={streamingService.name}
						aria-label={streamingService.name}>
						<div className='platform-tile'>
							<img
								className='mobile-streaming-logo'
								alt={streamingService.name}
								src={streamingService.logo}
							/>
							<span className='platform-check'>✓</span>
						</div>
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</div>
	);
};
