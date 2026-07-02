import { CustomError } from "@/common/plugins/error-handler";

export const UserService = {
	async login(username: string, password: string) {
		// 示例代码：实际中应从数据库查询用户并校验密码
		if (username === "admin" && password === "123456") {
			return "user-123456"; // 返回 userId 交由 Controller 签发 Token
		}
		throw new CustomError(1001, "用户名或密码错误");
	},
};
