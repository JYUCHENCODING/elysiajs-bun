import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { helmet } from 'elysia-helmet'
import { rateLimit } from 'elysia-rate-limit'
import { loggerMiddleware, logger } from './common/middlewares/logger'
import { errorHandler } from './common/plugins/error-handler'
import { userController } from './modules/user/user.controller'

const app = new Elysia()
  // 安全与网络层中间件
  .use(cors())
  .use(helmet())
  .use(rateLimit())
  // 全局中间件 & 插件
  .use(loggerMiddleware)
  .use(errorHandler)
  .use(swagger({
    documentation: {
      info: {
        title: 'Bun Elysia API',
        version: '1.0.0'
      }
    }
  }))
  // 路由模块
  .use(userController)
  
  // 启动监听
  .listen(3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
console.log(`📖 Swagger API 文档地址: http://${app.server?.hostname}:${app.server?.port}/swagger`)

// 优雅停机 (Graceful Shutdown)
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server...')
  app.stop().then(() => {
    logger.info('Server stopped gracefully.')
    process.exit(0)
  }).catch((err) => {
    logger.error(err)
    process.exit(1)
  })
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
