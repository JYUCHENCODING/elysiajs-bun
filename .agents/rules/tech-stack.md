# 技术栈约束规范

本项目基于 **Bun + ElysiaJS + Prisma + Biome** 开发，AI 在编写、重构或审查代码时必须遵循以下原则：

## 1. 强制优先使用 Bun 原生 API

本项目运行在 Bun 环境中，绝大部分场景应避免使用 Node.js 的内置模块。
- **文件操作**：请使用 `Bun.file()` 和 `Bun.write()`，取代 `fs` 模块。
- **HTTP 服务**：若脱离框架使用原生服务，应使用 `Bun.serve()`。
- **加密与哈希**：请使用 `Bun.password` 进行密码哈希，替代 `bcrypt` 等库。
- **测试**：必须使用 `bun test` 及其内置模块（`expect`, `describe`, `it` 等），不使用 Jest 或 Vitest。

## 2. ElysiaJS 与端到端类型安全

使用 Elysia 框架时，最重要的约束是**强类型保证**。
- **验证与推导**：强制使用 Elysia 内置的 Typebox (`t` 来自 `elysia`) 定义 schema (如 `body`, `query`, `params`, `response`)。
- **避免 Any**：不允许出现 `any` 类型。必须利用 Elysia 自动推导的能力，确保前线与服务间的类型完全一致。
- **插件架构**：所有中间件、状态和工具必须以 Elysia 插件形式编写。

## 3. 数据库规范 (Prisma)

- **单例模式**：在全局作用域内保持唯一的 Prisma Client 实例，以避免在热重载 (HMR) 或高并发时创建过多的数据库连接。
- **模型和扩展**：尽量利用 Prisma 的 select 和 include，避免产生 N+1 查询。
- **无显式 ORM 绕过**：所有数据库交互必须通过 Prisma 进行，不手写原生 SQL，除非是极其复杂的统计查询。

## 4. 代码格式化与 Linting (Biome)

本项目强制使用 Biome (`@biomejs/biome`) 作为唯一的代码格式化和代码质量检查工具。
- **禁用 Prettier / ESLint**：绝不要在项目中添加或建议使用 ESLint 或 Prettier，这会与 Biome 冲突。
- **严格类型与空值处理**：严格遵守 Biome 的规范，绝对禁止使用 `any` 类型，也绝对禁止使用非空断言操作符 `!`。对于可能为空的值，必须使用类型收窄（Type Narrowing，例如 `if (!val) throw new Error(...)`）或可选链（Optional Chaining，`?.`）进行安全访问。
- **自动修复**：编写完代码后，AI 应确保代码符合 Biome 规则。用户也可通过 `bun run lint:fix` 修正代码风格。

## 5. 环境变量与配置规范
- **强类型校验**：应用启动时，必须使用 ElysiaJS 内置的 Typebox (`t`) 对 `process.env` 中的所有关键环境变量进行运行时强类型校验。
- **集中管理**：环境变量的验证和默认值应集中在一处配置，杜绝在业务代码中随意使用未校验的 `process.env.XXX`。

## 6. 测试规范
- **测试框架**：强制使用 `bun test`。
- **测试文件位置**：采用**就近维护**原则。测试文件必须与被测试的源码文件放在同一级目录下，并命名为 `*.test.ts` (例如 `user.service.test.ts` 必须放在 `src/modules/user/` 目录下)。
- **Mocking**：使用 `bun test` 内置的 `mock` 功能或依赖注入来隔离 Prisma 和外部接口调用。
