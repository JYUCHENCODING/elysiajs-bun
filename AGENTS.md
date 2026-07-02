# AI Agents 协作指南

本项目已配置通用 AI 辅助开发规则。无论使用哪种 AI 工具进行代码编写、重构或审查，都必须阅读并遵守以下规则。

## 详细规则文档

1. **[技术栈核心规范](./.agents/rules/tech-stack.md)**
   - 包含 Bun 生态、ElysiaJS 框架的最佳实践、Prisma 数据库交互规范以及强制使用 Biome 作为 Lint 工具的要求。

2. **[架构与编码规范](./.agents/rules/architecture.md)**
   - 包含基于 Controller、Service 和 Schema 的三层模块化文件划分、职责隔离及命名规范。

3. **[AI 行为与工作流规范](./.agents/rules/ai-behavior.md)**
   - 包含“不确定即提问”、“最少修改原则”、TDD 工作流，以及严格使用中文并遵循 Angular 规范的 Commit 要求。

## 全局提醒
- **中文回答**：请必须使用中文与用户对话。需要生成 Git 提交信息时，也使用中文描述。
- **极简对话**：用最简洁的话回答，避免输出不必要的内容以节省 token 量。
- **目标导向**：执行任务时应转化为可验证的目标（如先写测试用例，再让其通过）。
