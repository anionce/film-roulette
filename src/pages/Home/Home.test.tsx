import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { customRender } from '../../assets/tests/testUtils';
import { Home } from './Home';

test('renders correcly', () => {
	const { container } = customRender(<Home />);

	expect(container).toMatchSnapshot();
});
