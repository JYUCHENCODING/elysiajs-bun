import { ErrorCode } from "@/common/constants/error-codes";
import { CustomError } from "@/common/plugins/error-handler";

export const UserService = {
	async login(username: string, password: string) {
		// 示例代码：实际中应从数据库查询用户并校验密码
		if (username === "admin" && password === "123456") {
			return "user-123456"; // 返回 userId 交由 Controller 签发 Token
		}
		throw new CustomError(ErrorCode.INVALID_CREDENTIALS);
	},

	// 示例：更新用户资料（演示显式传递 userId 进行审计）
	async updateProfile(
		targetUserId: string,
		_data: unknown,
		currentUserId?: string,
	) {
		const operatorId = currentUserId || targetUserId;
		// 实际业务中可将 operatorId 记录到 db 的 updatedBy 字段
		// await prisma.user.update({ where: { id: targetUserId }, data: { ...data, updatedBy: operatorId } })
		return { success: true, operatorId };
	},
};
