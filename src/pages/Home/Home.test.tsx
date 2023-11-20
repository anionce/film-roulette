/* import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { customRender } from '../../assets/tests/testUtils';
import { Home } from './Home';
import { screen } from '@testing-library/react';

const homeElements = {
	homeContainer: 'homeContainer',
	homeQuestions: 'homeQuestions',
	homeMovie: 'homeMovie',
};

test('renders correcly', () => {
	const { container } = customRender(<Home />);

	expect(container).toMatchSnapshot();
});

test('should render all elements', () => {
	customRender(<Home />);
	const button = screen.getByText('PLAY');

	Object.values(homeElements).forEach(element => {
		expect(screen.getByTestId(element)).toBeInTheDocument();
	});
	expect(button).toBeInTheDocument();
});
 */
