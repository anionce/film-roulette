import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { customRender } from '../../assets/tests/testUtils';
import { Selector, SelectorProps } from './Selector';
import { SelectValue } from '../../constants/selector';
import { MovieGenre } from '../../constants/genre';
import { fireEvent, screen } from '@testing-library/react';
import { MovieRuntime, runtimeSelectorOptions } from '../../constants/runtime';

const defaultProps: SelectorProps = {
	selectorValue: SelectValue.Genre,
	onChange: jest.fn(),
	selectedOption: MovieGenre.Action,
};

test('renders correcly', () => {
	const { container } = customRender(<Selector {...defaultProps} />);

	expect(container).toMatchSnapshot();
});

test('when clicking on select with duration, all options are displayed', () => {
	customRender(
		<Selector {...defaultProps} selectorValue={SelectValue.Runtime} selectedOption={MovieRuntime.Short} />
	);

	fireEvent.mouseDown(screen.getByText(runtimeSelectorOptions[0].text));

	const durations = runtimeSelectorOptions
		.map(runtime => runtime.text)
		.filter(runtime => runtime !== runtimeSelectorOptions[0].text);

	durations.forEach(duration => {
		expect(screen.getByText(duration)).toBeInTheDocument();
	});
});

test('when clicking on select with genre, all options are displayed', () => {
	customRender(<Selector {...defaultProps} />);

	fireEvent.mouseDown(screen.getByText(defaultProps.selectedOption));

	const genres = Object.values(MovieGenre).filter(genre => genre !== defaultProps.selectedOption);

	genres.forEach(genre => {
		expect(screen.getByText(genre)).toBeInTheDocument();
	});
});

test('when selecting an option, onChange should be called and the option will be displayed', () => {
	customRender(<Selector {...defaultProps} />);

	fireEvent.mouseDown(screen.getByText(defaultProps.selectedOption));

	fireEvent.click(screen.getByText(MovieGenre.Comedy));

	expect(defaultProps.onChange).toHaveBeenCalled();

	expect(screen.getByText(MovieGenre.Comedy)).toBeInTheDocument();
});
