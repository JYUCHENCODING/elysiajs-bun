import { Elysia } from "elysia";
import { authMiddleware, jwtSetup } from "@/common/plugins/auth";
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
			// 在 authMiddleware 验证通过后，user 将被安全地注入到上下文中
			return success({ id: user.id }, "获取用户信息成功");
		},
		{
			detail: {
				summary: "获取个人信息",
				description: "需要携带合法的 Bearer Token",
			},
		},
	);
