module.exports = {
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx}', '<rootDir>/src/**/?(*.)(spec|test).{ts,tsx}'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	moduleNameMapper: {
		'\\.(css|jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__tests__/__mocks__/fileMock.ts',
	},
	setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'],
	modulePathIgnorePatterns: ['__mocks__', '__fixtures__'],
	coverageDirectory: './coverage',
	testEnvironment: 'jsdom',
};
