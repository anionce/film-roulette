import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { customRender } from '../../assets/tests/testUtils';
import { Filter } from './Filter';

const defaultProps = {
	onTypeChanged: jest.fn(),
};

test('renders correcly', () => {
	const { container } = customRender(<Filter {...defaultProps} />);

	expect(container).toMatchSnapshot();
});

test('all elements are displayed', () => {
	customRender(<Filter {...defaultProps} />);

	expect(screen.getByText('xxxx')).toBeInTheDocument();
});
