import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	envDir: process.env.VITEST ? false : undefined,
	server: {
		port: 3000,
	},
	build: {
		outDir: 'build',
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		execArgv: ['--no-experimental-webstorage'],
	},
});
