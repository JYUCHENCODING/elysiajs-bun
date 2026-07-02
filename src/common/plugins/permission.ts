import { Elysia } from "elysia";
import { ErrorCode, ErrorCodeMap } from "../constants/error-codes";

export const permissionPlugin = new Elysia({ name: "plugin/permission" }).macro(
	({ onBeforeHandle }) => ({
		requirePermissions(permissions: string[]) {
			// biome-ignore lint/suspicious/noExplicitAny: Elysia 宏上下文目前较难推断完整的组合类型
			onBeforeHandle((context: any) => {
				const user = context.user;
				if (!user) {
					const { message, status } = ErrorCodeMap[ErrorCode.UNAUTHORIZED];
					return Response.json(
						{ code: ErrorCode.UNAUTHORIZED, message, data: null },
						{ status },
					);
				}

				// TODO: 真实业务中应从 DB、Redis 或 JWT 中获取当前用户的权限列表
				const mockUserPermissions = ["user:read", "user:write"];

				const hasPermission = permissions.every((p) =>
					mockUserPermissions.includes(p),
				);

				if (!hasPermission) {
					const { message, status } = ErrorCodeMap[ErrorCode.FORBIDDEN];
					return Response.json(
						{ code: ErrorCode.FORBIDDEN, message, data: null },
						{ status },
					);
				}
			});
		},
	}),
);
