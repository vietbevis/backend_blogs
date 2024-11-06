import { ERole, KEY, TokenType } from '@/utils/constants'
import { RequestHandler } from 'express'
import envConfig from '@/config/envConfig'
import { ForbiddenError, UnauthorizedError } from '@/core/ErrorResponse'
import { TokenService } from '@/services/TokenService'

interface AuthMiddleware {
  isAuthenticated: RequestHandler
  authorizeRole: (roles: ERole[]) => RequestHandler
}

const tokenService = new TokenService()

const AuthMiddleware: AuthMiddleware = {
  isAuthenticated: async (req, _res, next) => {
    // Check accessToken từ cookie hoặc header
    let accessToken = ''

    // Nếu ở chế độ cookie mode thì lấy token từ cookie
    // Ngược lại lấy token từ header
    if (envConfig.COOKIE_MODE) {
      const accessTokenFromCookie = req.cookies[KEY.COOKIE.ACCESS_TOKEN]
      if (!accessTokenFromCookie) throw new UnauthorizedError()
      accessToken = accessTokenFromCookie
    } else {
      const authorization = req.headers.authorization
      if (!authorization || !authorization.startsWith('Bearer ')) throw new UnauthorizedError()
      accessToken = authorization.split(' ')[1]
    }

    // Verify token
    try {
      const payload = await tokenService.verifyToken(accessToken, TokenType.ACCESS_TOKEN)
      if (!payload) throw new UnauthorizedError()

      req.user = payload.user
      next()
    } catch (error: any) {
      if (error.message.includes('TokenExpiredError')) throw new UnauthorizedError('Token expired')
      throw new UnauthorizedError('Invalid token')
    }
  },
  authorizeRole: (roles) => (req, _res, next) => {
    const userRoles = req.user?.roles as ERole[]

    if (!userRoles) throw new UnauthorizedError('User roles not found')

    // Kiểm tra xem ít nhất một role của user có nằm trong danh sách allowedRoles không
    const hasPermission = userRoles.some((role: ERole) => roles.includes(role))
    if (!hasPermission) throw new ForbiddenError('User does not have permission')

    next()
  }
}

export default AuthMiddleware
