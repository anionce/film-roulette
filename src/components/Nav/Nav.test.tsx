import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { customRender } from '../../assets/tests/testUtils';
import { Nav } from './Nav';

test('renders correcly', () => {
	const { container } = customRender(<Nav />);

	expect(container).toMatchSnapshot();
});

test('renders elements correctly', () => {
	customRender(<Nav />);

	expect(screen.getByText(/xxxxx/i)).toBeInTheDocument();
});
