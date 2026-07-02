import Elysia from "elysia";
import { ErrorCode, ErrorCodeMap } from "../constants/error-codes";
import { logger } from "../middlewares/logger";
import { fail } from "../response";

export class CustomError extends Error {
	public status: number;

	constructor(
		public code: ErrorCode,
		message?: string,
	) {
		const mapped = ErrorCodeMap[code] || ErrorCodeMap[ErrorCode.INTERNAL_ERROR];
		super(message || mapped.message);
		this.status = mapped.status;
	}
}

export const errorHandler = new Elysia({ name: "error-handler" })
	.error("CustomError", CustomError)
	.as("global")
	.onError(({ code, error }) => {
		logger.error(error);
		if (code === "CustomError" || error instanceof CustomError) {
			const customError = error as CustomError;
			return Response.json(fail(customError.code, customError.message), {
				status: customError.status,
			});
		}
		const message =
			error instanceof Error
				? error.message
				: (error as unknown as { message?: string }).message ||
					"Internal Server Error";

		return Response.json(fail(ErrorCode.INTERNAL_ERROR, message), {
			status: 500,
		});
	});
