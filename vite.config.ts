import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { recommendDevServer } from './netlify/devServer';

export default defineConfig({
	plugins: [react(), recommendDevServer()],
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
