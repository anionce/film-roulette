import type { IncomingMessage } from 'node:http';
import { loadEnv, type Plugin } from 'vite';

type FunctionHandler = (request: Request, context: { ip: string }) => Promise<Response>;

const FUNCTION_FILES: Record<string, string> = {
	'/api/recommend': '/netlify/functions/recommend.ts',
	'/api/watchlist': '/netlify/functions/watchlist.ts',
};

const readBody = async (request: IncomingMessage): Promise<string> => {
	const chunks: Buffer[] = [];
	for await (const chunk of request) chunks.push(chunk as Buffer);
	return Buffer.concat(chunks).toString('utf-8');
};

export const functionsDevServer = (): Plugin => ({
	name: 'functions-dev-server',
	configureServer(server) {
		const fileEnv = loadEnv(server.config.mode, server.config.envDir || process.cwd(), '');
		Object.assign(process.env, { ...fileEnv, ...process.env });

		for (const [route, file] of Object.entries(FUNCTION_FILES)) {
			server.middlewares.use(route, async (request, response) => {
				const { default: handler } = (await server.ssrLoadModule(file)) as { default: FunctionHandler };
				const body = request.method === 'POST' ? await readBody(request) : undefined;
				const query = request.originalUrl?.split('?')[1];
				const url = `http://localhost${route}${query ? `?${query}` : ''}`;
				const result = await handler(new Request(url, { method: request.method, body }), {
					ip: request.socket.remoteAddress ?? 'local',
				});
				response.statusCode = result.status;
				response.setHeader('Content-Type', 'application/json');
				response.end(await result.text());
			});
		}
	},
});
