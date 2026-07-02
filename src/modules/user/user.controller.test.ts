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
		expect(result.data).toBeDefined();
		if (!result.data) throw new Error("Missing data in response");

		expect(result.data.token).toBeTypeOf("string");

		// 保存拿到的真实 Token
		validToken = result.data.token;
	});

	it("should reject access to /profile without a token", async () => {
		const response = await app.handle(
			new Request("http://localhost/user/profile"),
		);

		const text = await response.text();
		const result = JSON.parse(text) as BaseResponse<null>;
		expect(response.status).toBe(401);
		expect(result.code).toBe(10001); // ErrorCode.UNAUTHORIZED
		expect(result.message).toContain("未登录");
	});

	it("should reject access to /profile with an invalid token", async () => {
		const response = await app.handle(
			new Request("http://localhost/user/profile", {
				headers: {
					Authorization: "Bearer fake-invalid-token",
				},
			}),
		);

		const result = (await response.json()) as BaseResponse<null>;
		expect(response.status).toBe(401);
		expect(result.code).toBe(10001);
		expect(result.message).toContain("未登录");
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
		expect(result.data).toBeDefined();
		expect(result.data?.id).toBe("user-123456");
	});
});
