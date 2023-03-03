import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { customRender } from '../../assets/tests/testUtils';
import { ErrorPage } from './ErrorPage';

test('renders correcly', () => {
	const { container } = customRender(<ErrorPage />);

	expect(container).toMatchSnapshot();
});

test('all elements are displayed', () => {
	customRender(<ErrorPage />);

	expect(screen.getByText(/Ooops!/i)).toBeInTheDocument();
	expect(screen.getByText(/There has been an error./i)).toBeInTheDocument();
	expect(screen.getByText(/Please try again later.../i)).toBeInTheDocument();
	expect(screen.getByAltText(/error/i)).toBeInTheDocument();
});
