import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { streamingServices, type StreamingServices } from '../../../constants/streamingServices';
import { useLanguage } from '../../../i18n/useLanguage';

type StreamingModalContentProps = {
	selected: StreamingServices[];
	onChange: (services: StreamingServices[]) => void;
};

const transparentToggleSx = {
	backgroundColor: 'transparent',
	border: 'none',
	padding: 0,
	'&.Mui-selected': { backgroundColor: 'transparent', '&:hover': { backgroundColor: 'transparent' } },
	'&:hover': { backgroundColor: 'transparent' },
};

export const StreamingModalContent = ({ selected, onChange }: StreamingModalContentProps) => {
	const { t } = useLanguage();

	return (
		<div className='streaming-modal-container'>
			<p>{t.streamingModalTitle}</p>
			<ToggleButtonGroup
				className='toggle-group'
				value={selected}
				onChange={(_, services: StreamingServices[]) => onChange(services)}
				size='small'
			>
				{streamingServices.map(service => (
					<ToggleButton
						disableRipple
						className='platform-toggle'
						sx={transparentToggleSx}
						key={service.name}
						value={service.name}
						aria-label={service.name}
					>
						<div className='platform-tile'>
							<img className='mobile-streaming-logo' alt='' src={service.logo} />
							<span className='platform-check'>✓</span>
						</div>
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</div>
	);
};
