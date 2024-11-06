import { TokenType } from '@/utils/constants'
import jwt from 'jsonwebtoken'
import envConfig from '@/config/envConfig'
import { User } from '@/models/User'
import { Role } from '@/models/Role'
import { Repository } from 'typeorm'
import { TokenUser } from '@/models/TokenUser'
import { AppDataSource } from '@/config/database'

export interface UserFromTokenPayload {
  id: string
  email: string
  roles: string[]
}

export interface TokenPayload {
  user: UserFromTokenPayload
  iat: number
  exp: number
  sub: string
}

export class TokenService {
  private tokenUserRepository: Repository<TokenUser> = AppDataSource.getRepository(TokenUser)

  async generateToken(payload: User | UserFromTokenPayload, tokenType: TokenType): Promise<string> {
    const user =
      payload instanceof User
        ? {
            id: payload.id,
            email: payload.email,
            roles: payload.roles.map((role: Role) => role.name)
          }
        : payload
    try {
      switch (tokenType) {
        case TokenType.ACCESS_TOKEN:
          return (
            jwt.sign({ user }, envConfig.ACCESS_TOKEN_SECRET, {
              expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
              subject: user.email
            }) || ''
          )
        case TokenType.REFRESH_TOKEN:
          return (
            jwt.sign({ user }, envConfig.REFRESH_TOKEN_SECRET, {
              expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
              subject: user.email
            }) || ''
          )
        default:
          return ''
      }
    } catch (error) {
      console.log('🚀 ~ file: token.service.ts:15 ~ error:', error)
      return ''
    }
  }

  async verifyToken(token: string, tokenType: TokenType): Promise<TokenPayload | null> {
    try {
      switch (tokenType) {
        case TokenType.ACCESS_TOKEN:
          return jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as TokenPayload
        case TokenType.REFRESH_TOKEN:
          return jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET) as TokenPayload
        default:
          return null
      }
    } catch (error) {
      console.log('🚀 ~ file: token.service.ts ~ verifyToken error:', error)
      return null
    }
  }

  async saveRefreshToken(user: User, refreshToken: string): Promise<boolean> {
    // Save refresh token to db
    // Đoạn này handle việc login 1 hay nhiều thiết bị
    let tokenUser = await this.tokenUserRepository.findOne({ where: { user: { id: user.id } } })
    if (tokenUser) {
      // Nếu đã có, cập nhật refreshToken mới
      tokenUser.refreshToken = refreshToken
    } else {
      // Nếu chưa có, tạo mới TokenUser với refreshToken
      tokenUser = this.tokenUserRepository.create({ user, refreshToken })
    }
    return !!(await this.tokenUserRepository.save(tokenUser))
  }

  async getTokenUser(userId: string): Promise<TokenUser | null> {
    return this.tokenUserRepository.findOne({ where: { user: { id: userId } } })
  }
}
