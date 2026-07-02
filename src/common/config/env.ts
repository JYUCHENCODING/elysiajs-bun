import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
	DATABASE_URL: Type.String(),
	JWT_SECRET: Type.String(),
});

// 在这里解析并校验 process.env
const envValues = {
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_SECRET: process.env.JWT_SECRET,
};

if (!Value.Check(EnvSchema, envValues)) {
	const errors = [...Value.Errors(EnvSchema, envValues)];
	console.error("❌ 环境变量校验失败:", errors);
	throw new Error("Invalid Environment Variables");
}

export const ENV = envValues;
