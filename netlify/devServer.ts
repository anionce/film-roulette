import type { IncomingMessage } from 'node:http';
import { loadEnv, type Plugin } from 'vite';
import recommend from './functions/recommend';

const FUNCTION_ROUTE = '/api/recommend';

const readBody = async (request: IncomingMessage): Promise<string> => {
	const chunks: Buffer[] = [];
	for await (const chunk of request) chunks.push(chunk as Buffer);
	return Buffer.concat(chunks).toString('utf-8');
};

export const recommendDevServer = (): Plugin => ({
	name: 'recommend-dev-server',
	configureServer(server) {
		const fileEnv = loadEnv(server.config.mode, server.config.envDir || process.cwd(), '');
		Object.assign(process.env, { ...fileEnv, ...process.env });

		server.middlewares.use(FUNCTION_ROUTE, async (request, response) => {
			const body = request.method === 'POST' ? await readBody(request) : undefined;
			const result = await recommend(new Request(`http://localhost${FUNCTION_ROUTE}`, { method: request.method, body }), {
				ip: request.socket.remoteAddress ?? 'local',
			});
			response.statusCode = result.status;
			response.setHeader('Content-Type', 'application/json');
			response.end(await result.text());
		});
	},
});
