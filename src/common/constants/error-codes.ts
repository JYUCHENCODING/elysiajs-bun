export enum ErrorCode {
	// 系统级错误 (10xxx)
	INTERNAL_ERROR = 10000,
	UNAUTHORIZED = 10001,
	FORBIDDEN = 10002,
	VALIDATION_ERROR = 10003,

	// 用户模块错误 (20xxx)
	USER_NOT_FOUND = 20001,
	USER_ALREADY_EXISTS = 20002,
	INVALID_CREDENTIALS = 20003,
}

export const ErrorCodeMap: Record<
	ErrorCode,
	{ status: number; message: string }
> = {
	[ErrorCode.INTERNAL_ERROR]: { status: 500, message: "系统内部错误" },
	[ErrorCode.UNAUTHORIZED]: { status: 401, message: "未登录或登录状态已失效" },
	[ErrorCode.FORBIDDEN]: { status: 403, message: "无权限访问此资源" },
	[ErrorCode.VALIDATION_ERROR]: { status: 400, message: "请求参数校验失败" },

	[ErrorCode.USER_NOT_FOUND]: { status: 404, message: "用户不存在" },
	[ErrorCode.USER_ALREADY_EXISTS]: { status: 400, message: "用户已存在" },
	[ErrorCode.INVALID_CREDENTIALS]: { status: 400, message: "账号或密码错误" },
};
