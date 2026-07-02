import { Elysia } from 'elysia'
import { UserSchema } from './user.schema'
import { UserService } from './user.service'
import { success } from '../../common/response'

export const userController = new Elysia({ prefix: '/user', tags: ['User'] })
  .post('/login', async ({ body }) => {
    const token = await UserService.login(body.username, body.password)
    return success({ token }, '登录成功')
  }, {
    body: UserSchema.LoginBody,
    response: {
      200: UserSchema.LoginResponse
    },
    detail: {
      summary: '用户登录',
      description: '使用用户名和密码进行登录验证'
    }
  })
