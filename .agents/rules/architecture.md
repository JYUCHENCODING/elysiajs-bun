# 项目架构与代码编写规范

为了保证项目的可维护性，所有新功能的开发必须严格遵循本项目约定的 **Controller-Service-Schema (CSS)** 三层模块化架构规范。这些规范基于 `src/modules/user` 的最佳实践。

## 1. 模块目录划分
所有的业务功能必须按**领域驱动 (Domain-Driven)** 划分在 `src/modules/[module-name]/` 目录下。例如用户模块的所有代码都应该在 `src/modules/user/` 中。

## 2. 文件类型与命名规范
每个模块目录下，强制要求拆分为以下三个核心文件，并采用 `[module-name].[type].ts` 命名：

### A. Controller 层 (`[module-name].controller.ts`)
**职责**：处理 HTTP 请求与响应、路由定义、Schema 绑定及 Swagger 文档元数据。
**规范**：
- 必须实例化一个带有 `prefix` 和 `tags` 的 `Elysia` 对象。
- **禁止**在此处编写复杂的业务逻辑或直接查询数据库。
- 必须调用 Service 层处理业务。
- 使用统一的响应结构（如 `success` 函数）返回结果。
- 必须在路由配置中绑定入参 (`body`, `query`, `params`) 和出参 (`response`) 的 Schema 校验。

### B. Service 层 (`[module-name].service.ts`)
**职责**：处理所有核心的业务逻辑、数据库交互等。
**规范**：
- 所有的具体业务处理逻辑都在此类中实现。
- 负责与数据库 (通过 Prisma Client) 交互。
- 遇到业务异常时，必须抛出统一的 `CustomError` 交由外层错误处理器捕获，不应自己吞没错误并直接返回 HTTP 状态。

### C. Schema 层 (`[module-name].schema.ts`)
**职责**：集中管理该模块中所有的 Typebox (Elysia `t`) 数据模型定义。
**规范**：
- 将模型对象组织在一起导出（如 `export const UserSchema = { ... }`）。
- 绝不将大块的 Schema 验证逻辑直接写在 Controller 文件内。
- 确保涵盖所有的请求体 (Body)、查询参数 (Query)、路径参数 (Params) 以及响应结果 (Response) 的验证结构。
