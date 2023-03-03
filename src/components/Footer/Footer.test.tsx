import React from 'react';
import { screen } from '@testing-library/react';
import { customRender } from '../../assets/tests/testUtils';
import { Footer } from './Footer';

test('renders correcly', () => {
	const { container } = customRender(<Footer />);

	expect(container).toMatchSnapshot();
});

test('renders elements correctly', () => {
	customRender(<Footer />);

	expect(screen.getByAltText(/xxxx/i)).toBeInTheDocument();
});
