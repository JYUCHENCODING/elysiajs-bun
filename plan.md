这份工程蓝图已经整理为标准的 Markdown 格式，你可以直接将其作为项目初始化的 `README.md` 或架构设计文档，用于指导后续的开发和规范团队/AI 的代码风格。

---

# 🏗️ Bun + ElysiaJS 现代化工程架构指南

本项目基于 **Bun** 运行时与 **ElysiaJS** 框架构建，旨在抛弃沉重的传统 OOP 模板代码，采用现代化的“插件式函数”范式，同时通过严格的工具链和目录架构保证企业级的规范性和一致性。

## 1. 工程底座与工具链 (Infrastructure)

为了保证极速的开发体验和绝对统一的代码风格，本工程采用以下底层配置：

* **运行时 & 包管理**: 统一使用 `Bun`，禁止使用 `npm`、`yarn` 或 `pnpm` 安装依赖。
* **代码格式化与校验 (Linter & Formatter)**: 使用 `Biome` 全面替代 ESLint + Prettier。
* **Git 提交规范**: 采用 `Husky` + `Commitlint` 强制执行 Angular 规范（如 `feat:`, `fix:`, `chore:`）。
* **AI 辅助编程规范**:
* 在项目根目录维护 `.cursorrules` 和 `.clauderc` 等 AI 上下文配置文件。
* 建议在 macOS 环境下，通过软链接（`ln -s`）将这些文件接入你的全局 AI 技能目录，确保 Cursor、Claude Code 等 Agent 以及 MCP 工具在生成代码时，严格遵循本项目基于 TypeBox 和 Elysia 插件组合的范式。



## 2. 核心目录架构 (Architecture)

采用 **按业务功能模块 (Feature-Based)** 的目录结构。核心原则是“高内聚、低耦合”，每个业务模块自治。

```text
📦 project-root
 ┣ 📂 prisma            # Prisma 数据库 Schema 与迁移文件
 ┣ 📂 src
 ┃ ┣ 📂 common          # 全局通用逻辑 (与具体业务无关)
 ┃ ┃ ┣ 📂 db            # 数据库连接单例 (Prisma Client)
 ┃ ┃ ┣ 📂 middlewares   # 全局中间件 (鉴权、请求日志等)
 ┃ ┃ ┣ 📂 plugins       # Elysia 全局插件 (Swagger, 统一异常处理)
 ┃ ┃ ┣ 📂 utils         # 工具函数 (日期处理、加密等)
 ┃ ┃ ┗ 📜 response.ts   # 统一返回结构封装
 ┃ ┣ 📂 modules         # 核心业务模块目录
 ┃ ┃ ┣ 📂 user          # 示例：用户模块
 ┃ ┃ ┃ ┣ 📜 user.schema.ts      # TypeBox 数据模型定义 (入参/出参/数据库实体)
 ┃ ┃ ┃ ┣ 📜 user.service.ts     # 纯业务逻辑函数 (无请求上下文)
 ┃ ┃ ┃ ┣ 📜 user.controller.ts  # Elysia 插件实例 (路由绑定、Schema校验)
 ┃ ┃ ┃ ┗ 📜 user.test.ts        # 模块单元测试
 ┃ ┃ ┗ 📂 order         # 示例：订单模块
 ┃ ┃   ┗ ...
 ┃ ┗ 📜 index.ts        # 应用主入口 (组装所有模块并启动监听)
 ┣ 📜 biome.json        # Biome 配置文件
 ┣ 📜 package.json      
 ┣ 📜 tsconfig.json     # Bun 默认 TypeScript 配置
 ┗ 📜 .cursorrules      # AI 编码规范 (软链接指向全局配置)

```

## 3. 开发规范与数据流转 (Data Flow Conventions)

为了降低理解成本，所有成员（包括 AI）必须遵循以下数据流转范式：

### 3.1 Schema 驱动开发

禁止在业务代码中手写参数校验。所有 HTTP 请求的 `body`、`query`、`params` 以及返回的 `response`，必须在 `*.schema.ts` 中使用 Elysia 内置的 `t` (TypeBox) 进行声明，由框架层自动拦截。

### 3.2 纯粹的 Service 层

`Service` 层文件只允许导出普通函数或静态类。它们负责接收明确类型的参数，操作数据库（如 Prisma/Drizzle），并返回结果。

* **禁止**在 Service 层引入或操作 `Context` (Request/Response 对象)。

### 3.3 插件式的 Controller

`Controller` 在本项目中等同于封装好的 Elysia 实例（Plugin）。通过 `.use()` 进行组装，保持路由清晰。

```typescript
// 示例：标准化的 Controller 开发范式
import { Elysia } from 'elysia';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

export const userController = new Elysia({ prefix: '/user' })
  .post('/login', async ({ body }) => {
    const token = await UserService.login(body.username, body.password);
    return { code: 0, data: { token }, message: 'success' };
  }, {
    body: UserSchema.LoginBody, // 自动校验入参
    response: UserSchema.LoginResponse // 自动约束出参并生成文档
  });

```

### 3.4 统一异常处理

业务逻辑中遇到错误直接 `throw` 对应的自定义 Error（如 `throw new NotFoundError('用户不存在')`）。通过 `src/common/plugins/error-handler.ts` 捕获全局异常，保证给前端返回格式一致的 JSON。

## 4. 初始化与启动命令 (Scripts)

确保 `package.json` 中包含以下标准化指令，配合 `bun test` 提供原生的高性能测试：

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "start": "bun run src/index.ts",
    "lint": "biome check src/",
    "lint:fix": "biome check --write src/",
    "test": "bun test"
  }
}
```

## 5. 核心基建集成规范 (Core Integrations)

为实现“开箱即用”的业务开发，需集成以下核心组件：

### 5.1 数据库 ORM (Prisma)
- **配置与模型**: 根目录维护 `prisma/schema.prisma`。
- **全局单例**: 在 `src/common/db/prisma.ts` 中初始化全局 `PrismaClient`，避免连接池爆满。
- **调用限制**: 仅允许在 Service 层调用 PrismaClient，保证数据操作的纯粹性。

### 5.2 接口文档 (OpenAPI / Swagger)
- **插件集成**: 在 `src/index.ts` 全局挂载 `@elysiajs/swagger` 插件。
- **文档生成**: 直接复用业务开发中写的 TypeBox (`t.*`) Schema，无需额外编写文档，确保代码与文档零误差。

### 5.3 全局日志 (Logging)
- **统一拦截**: 在 `src/common/middlewares/logger.ts` 中实现日志中间件，自动记录每次请求的 Method, Path, 耗时及异常堆栈。
- **日志库选择**: 推荐集成 `pino`（或 Elysia 社区 logger），禁止在生产环境遗留 `console.log`。