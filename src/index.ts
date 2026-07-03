import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { rateLimit } from "elysia-rate-limit";
import { logger, loggerMiddleware } from "./common/middlewares/logger";
import { errorHandler } from "./common/plugins/error-handler";
import { userController } from "./modules/user/user.controller";

export const app = new Elysia()
	// 安全与网络层中间件
	.use(cors())
	.use(
		helmet({
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					"script-src": [
						"'self'",
						"'unsafe-inline'",
						"https://cdn.jsdelivr.net",
					],
					"style-src": [
						"'self'",
						"'unsafe-inline'",
						"https://fonts.googleapis.com",
					],
					"font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
					"img-src": ["'self'", "data:", "https://validator.swagger.io"],
				},
			},
		}),
	)
	.use(
		rateLimit({
			duration: 60000, // 1 分钟窗口
			max: 100, // 允许 100 次请求
			errorResponse: "请求过于频繁，请稍后再试", // 自定义报错信息
		}),
	)
	// 全局中间件 & 插件
	.use(loggerMiddleware)
	.use(errorHandler)
	.use(
		swagger({
			documentation: {
				info: {
					title: "Bun Elysia API",
					version: "1.0.0",
				},
				components: {
					securitySchemes: {
						JwtAuth: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
							description: "请输入 JWT Token",
						},
					},
				},
				security: [
					{
						JwtAuth: [],
					},
				],
			},
		}),
	)
	// 路由模块
	.use(userController)

	// 启动监听
	.listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
console.log(
	`📖 Swagger API 文档地址: http://${app.server?.hostname}:${app.server?.port}/swagger`,
);

// 优雅停机 (Graceful Shutdown)
const gracefulShutdown = () => {
	logger.info("Received shutdown signal, closing server...");
	app
		.stop()
		.then(() => {
			logger.info("Server stopped gracefully.");
			process.exit(0);
		})
		.catch((err) => {
			logger.error(err);
			process.exit(1);
		});
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
