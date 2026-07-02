import Elysia from "elysia";
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino(
	isDev
		? { transport: { target: "pino-pretty", options: { colorize: true } } }
		: {},
);

export const loggerMiddleware = new Elysia().onRequest(({ request }) => {
	const method = request.method;
	const url = new URL(request.url).pathname;
	logger.info(`${method} ${url}`);
});
