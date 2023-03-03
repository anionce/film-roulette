import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { customRender } from '../../assets/tests/testUtils';
import { Input } from './Input';

test('renders correcly', () => {
	const { container } = customRender(<Input />);

	expect(container).toMatchSnapshot();
});

test('renders elements correctly', () => {
	customRender(<Input />);

	expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
});
