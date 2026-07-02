import { jwt } from "@elysiajs/jwt";
import type { Elysia } from "elysia";
import { ENV } from "../config/env";
import { ErrorCode, ErrorCodeMap } from "../constants/error-codes";
import { errorHandler } from "./error-handler";

// 注册 JWT 配置，并导出供登录接口生成 Token 时使用
export const jwtSetup = jwt({
	name: "jwt",
	secret: ENV.JWT_SECRET,
});

export const authMiddleware = (app: Elysia) =>
	app
		.use(errorHandler)
		.use(jwtSetup)
		.derive(async ({ jwt, headers }) => {
			const authorization = headers.authorization;
			if (!authorization?.startsWith("Bearer ")) {
				return { user: null };
			}
			const token = authorization.slice(7);
			const payload = await jwt.verify(token);
			if (!payload) {
				return { user: null };
			}
			return {
				user: { id: (payload as { id: string }).id },
			};
		})
		.onBeforeHandle(({ user }) => {
			if (!user) {
				const { message, status } = ErrorCodeMap[ErrorCode.UNAUTHORIZED];
				return Response.json(
					{ code: ErrorCode.UNAUTHORIZED, message, data: null },
					{ status },
				);
			}
		});
