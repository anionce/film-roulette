import React from 'react';
import { screen } from '@testing-library/react';
import { Card } from './Card';
import { customRender } from '../../assets/tests/testUtils';
import '@testing-library/jest-dom/extend-expect';

const defaultProps = { example: '' };

test('renders correcly', () => {
	const { container } = customRender(<Card {...defaultProps} />);

	expect(container).toMatchSnapshot();
});

test('renders elements correctly', () => {
	customRender(<Card {...defaultProps} />);

	expect(screen.getByText(/xxxx/i)).toBeInTheDocument();
});
