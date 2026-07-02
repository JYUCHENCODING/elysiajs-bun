import { describe, expect, it } from "bun:test";
import type { BaseResponse } from "@/common/response";
import { app } from "@/index";

describe("User Controller", () => {
	let validToken = "";

	it("should return a real JWT token on login", async () => {
		const response = await app.handle(
			new Request("http://localhost/user/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: "admin",
					password: "123456",
				}),
			}),
		);

		const result = (await response.json()) as BaseResponse<{ token: string }>;
		expect(response.status).toBe(200);
		expect(result.code).toBe(0);
		expect(result.data.token).toBeTypeOf("string");

		// 保存拿到的真实 Token
		validToken = result.data.token;
	});

	it("should reject access to /profile without a token", async () => {
		const response = await app.handle(
			new Request("http://localhost/user/profile"),
		);

		const text = await response.text();
		expect(response.status).toBe(500); // Note: Elysia defaults to 500 for thrown errors without explicit status mapping in global errorHandler when plugin scope differs
		expect(text).toContain("未登录或登录状态已失效");
	});

	it("should reject access to /profile with an invalid token", async () => {
		const response = await app.handle(
			new Request("http://localhost/user/profile", {
				headers: {
					Authorization: "Bearer fake-invalid-token",
				},
			}),
		);

		const text = await response.text();
		expect(response.status).toBe(500);
		expect(text).toContain("未登录或登录状态已失效");
	});

	it("should allow access to /profile with a valid token", async () => {
		const response = await app.handle(
			new Request("http://localhost/user/profile", {
				headers: {
					Authorization: `Bearer ${validToken}`,
				},
			}),
		);

		const result = (await response.json()) as BaseResponse<{ id: string }>;
		expect(response.status).toBe(200);
		expect(result.code).toBe(0);
		// 校验我们刚才拿到的 user 信息是否成功注入
		expect(result.data.id).toBe("user-123456");
	});
});
