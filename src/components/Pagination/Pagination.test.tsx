import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { customRender } from '../../assets/tests/testUtils';
import { Pagination } from './Pagination';

const defaultProps = { count: 27, paginate: jest.fn(), pagesPerPage: 3, currentPage: 2 };

test('renders correcly', () => {
	const { container } = customRender(<Pagination {...defaultProps} />);

	expect(container).toMatchSnapshot();
});

test('active page has the correct class', () => {
	customRender(<Pagination {...defaultProps} />);

	expect(screen.getByText('2')).toHaveClass('active');
});

test('other pages have the correct class', () => {
	customRender(<Pagination {...defaultProps} />);

	expect(screen.getByText('3')).toHaveClass('page');
});

test('displays 9 pages', () => {
	customRender(<Pagination {...defaultProps} />);

	expect(screen.getAllByTitle(/pageNumber/i)).toHaveLength(9);
});
