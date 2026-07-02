import { Elysia } from "elysia";
import { ErrorCode } from "../constants/error-codes";
import { CustomError } from "./error-handler";

export const permissionPlugin = new Elysia({ name: "plugin/permission" }).macro(
	({ onBeforeHandle }) => ({
		requirePermissions(permissions: string[]) {
			onBeforeHandle((context) => {
				// @ts-expect-error 因为是宏，在外部调用时才会组合 user 类型
				const user = context.user;
				if (!user) throw new CustomError(ErrorCode.UNAUTHORIZED);

				// TODO: 真实业务中应从 DB、Redis 或 JWT 中获取当前用户的权限列表
				const mockUserPermissions = ["user:read", "user:write"];

				const hasPermission = permissions.every((p) =>
					mockUserPermissions.includes(p),
				);

				if (!hasPermission) {
					throw new CustomError(ErrorCode.FORBIDDEN);
				}
			});
		},
	}),
);
