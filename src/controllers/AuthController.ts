import { RequestHandler } from 'express'
import { LoginBodyType, RefreshTokenBodyType, RegisterBodyType } from '@/validations/AuthSchema'
import { CreatedResponse, OkResponse } from '@/core/SuccessResponse'
import { UserService } from '@/services/UserService'
import { AuthService } from '@/services/AuthService'
import envConfig from '@/config/envConfig'
import { KEY } from '@/utils/constants'
import ms from 'ms'

interface AuthController {
  login: RequestHandler<unknown, unknown, LoginBodyType, unknown>
  register: RequestHandler<unknown, unknown, RegisterBodyType, unknown>
  refresh: RequestHandler<unknown, unknown, RefreshTokenBodyType, unknown>
}

const userService = new UserService()
const authService = new AuthService()

export const AuthController: AuthController = {
  login: async (req, res) => {
    const token = await authService.loginUser(req.body)
    if (envConfig.COOKIE_MODE) {
      res.cookie(KEY.COOKIE.ACCESS_TOKEN, token.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms(envConfig.ACCESS_TOKEN_EXPIRES_IN)
      })
      res.cookie(KEY.COOKIE.REFRESH_TOKEN, token.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms(envConfig.REFRESH_TOKEN_EXPIRES_IN)
      })
    }
    new OkResponse('Login successfully', token).send(res)
  },
  register: async (req, res) => {
    await authService.registerUser(req.body)
    new CreatedResponse('Register successfully').send(res)
  },
  refresh: async (req, res) => {
    const token = await authService.refreshToken(req.body.refreshToken, req.user)
    new OkResponse('Refresh token successfully', token).send(res)
  }
}
