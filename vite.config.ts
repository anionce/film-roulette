import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { functionsDevServer } from './netlify/devServer.ts';

export default defineConfig({
	plugins: [react(), functionsDevServer()],
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
