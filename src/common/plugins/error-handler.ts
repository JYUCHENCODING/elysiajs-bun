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

export const errorHandler = new Elysia({ name: "error-handler" }).onError(
	({ error }) => {
		logger.error(error);
		if (error instanceof CustomError) {
			return fail(error.code, error.message);
		}
		return fail(-1, error.message || "Internal Server Error");
	},
);
