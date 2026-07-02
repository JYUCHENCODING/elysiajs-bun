import Elysia from "elysia";
import { logger } from "../middlewares/logger";
import { fail } from "../response";

export class CustomError extends Error {
	constructor(
		public code: number,
		message: string,
	) {
		super(message);
	}
}

export const errorHandler = new Elysia().onError(({ error }) => {
	logger.error(error);
	if (error instanceof CustomError) {
		return Response.json(fail(error.code, error.message), {
			status: error.code,
		});
	}
	const message =
		error instanceof Error
			? error.message
			: (error as unknown as { message?: string }).message ||
				"Internal Server Error";

	return Response.json(fail(-1, message), {
		status: 500,
	});
});
