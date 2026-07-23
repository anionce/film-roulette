import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { PlayButton } from './PlayButton';
import { FilterArguments } from '../../constants/filters';
import { MovieGenre } from '../../constants/genre';
import { MovieRuntime } from '../../constants/runtime';
import { customRender } from '../../assets/tests/testUtils';

const renderPlayButton = (filters: FilterArguments, onButtonClick = jest.fn()) => {
	customRender(<PlayButton filters={filters} onButtonClick={onButtonClick} />);

	return { onButtonClick };
};

describe('PlayButton', () => {
	it('renders disabled when genre or duration filters are missing', () => {
		renderPlayButton({ genre: null, duration: null, streaming: null });

		const button = screen.getByLabelText('Buscar película');
		expect(button).toHaveAttribute('aria-disabled', 'true');
	});

	it('does not call onButtonClick when clicked while disabled', () => {
		const { onButtonClick } = renderPlayButton({ genre: null, duration: null, streaming: null });

		fireEvent.click(screen.getByLabelText('Buscar película'));

		expect(onButtonClick).not.toHaveBeenCalled();
	});

	it('renders enabled once both genre and duration filters are selected', () => {
		renderPlayButton({ genre: [MovieGenre.Comedy], duration: MovieRuntime.Short, streaming: null });

		const button = screen.getByLabelText('Buscar película');
		expect(button).toHaveAttribute('aria-disabled', 'false');
	});

	it('calls onButtonClick with false when clicked while enabled', () => {
		const { onButtonClick } = renderPlayButton({
			genre: [MovieGenre.Comedy],
			duration: MovieRuntime.Short,
			streaming: null,
		});

		fireEvent.click(screen.getByLabelText('Buscar película'));

		expect(onButtonClick).toHaveBeenCalledWith(false);
	});
});
