import { Elysia } from "elysia";
import { authMiddleware, jwtSetup } from "@/common/plugins/auth";
import { CustomError } from "@/common/plugins/error-handler";
import { success } from "@/common/response";
import { UserSchema } from "./user.schema";
import { UserService } from "./user.service";

export const userController = new Elysia({
	prefix: "/user",
	tags: ["User"],
})
	.use(jwtSetup)
	.post(
		"/login",
		async ({ body, jwt }) => {
			// Service 层仅负责校验逻辑并返回业务所需的 userId
			const userId = await UserService.login(body.username, body.password);

			// Controller 层负责通过注入的 jwt 签发真实 Token
			const token = await jwt.sign({ id: userId });
			return success({ token }, "登录成功");
		},
		{
			body: UserSchema.LoginBody,
			response: {
				200: UserSchema.LoginResponse,
			},
			detail: {
				summary: "用户登录",
				description: "使用用户名和密码进行登录验证",
			},
		},
	)
	// --- 下面的路由需要鉴权 ---
	.use(authMiddleware)
	.get(
		"/profile",
		({ user }) => {
			// 虽然 authMiddleware 已保证不为 null，但加上显式判断可同时满足 TS 和 Biome lint 规范
			if (!user) throw new CustomError(401, "未登录或登录状态已失效");
			return success({ id: user.id }, "获取用户信息成功");
		},
		{
			detail: {
				summary: "获取个人信息",
				description: "需要携带合法的 Bearer Token",
			},
		},
	);
