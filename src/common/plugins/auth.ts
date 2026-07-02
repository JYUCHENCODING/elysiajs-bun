import { jwt } from "@elysiajs/jwt";
import type { Elysia } from "elysia";
import { ENV } from "../config/env";
import { CustomError } from "./error-handler";

// 注册 JWT 配置，并导出供登录接口生成 Token 时使用
export const jwtSetup = jwt({
	name: "jwt",
	secret: ENV.JWT_SECRET,
});

export const authMiddleware = (app: Elysia) =>
	app
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
				throw new CustomError(401, "未登录或登录状态已失效");
			}
		});
