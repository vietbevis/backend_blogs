import jwt from 'jsonwebtoken'
import envConfig from '@/config/envConfig'
import { User } from '@/models/User'
import { Role } from '@/models/Role'
import { Repository } from 'typeorm'
import { TokenUser } from '@/models/TokenUser'
import { AppDataSource } from '@/config/database'
import ms from 'ms'
import crypto from 'crypto'
import { BadRequestError, UnauthorizedError } from '@/core/ErrorResponse'
import MESSAGES from '@/utils/message'

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

  async generateToken(payload: User | UserFromTokenPayload) {
    const user =
      payload instanceof User
        ? {
            id: payload.id,
            email: payload.email,
            roles: payload.roles.map((role: Role) => role.name)
          }
        : payload
    try {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
      })

      const [accessToken, refreshToken] = await Promise.all([
        jwt.sign({ user }, privateKey, {
          expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
          subject: user.email,
          algorithm: 'RS256'
        }),
        jwt.sign({ user }, privateKey, {
          expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
          subject: user.email,
          algorithm: 'RS256'
        })
      ])
      // Save refresh token to db
      await this.saveRefreshToken(user, publicKey)

      return { accessToken, refreshToken, publicKey }
    } catch (error) {
      throw new BadRequestError(MESSAGES.ERROR.TOKEN.GENERATE)
    }
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    const payload = jwt.decode(token) as TokenPayload

    const tokenUser = await this.tokenUserRepository.findOneBy({ user: { id: payload.user.id } })
    if (!tokenUser) throw new UnauthorizedError()
    try {
      return jwt.verify(token, tokenUser.publicKey, {
        algorithms: ['RS256']
      }) as TokenPayload
    } catch (error) {
      throw new UnauthorizedError()
    }
  }

  async saveRefreshToken(user: User | UserFromTokenPayload, publicKey: string): Promise<boolean> {
    // Save refresh token to db
    // Đoạn này handle việc login 1 hay nhiều thiết bị
    let tokenUser = await this.tokenUserRepository.findOne({ where: { user: { id: user.id } } })
    if (tokenUser) {
      // Nếu đã có, cập nhật publicKey mới
      tokenUser.publicKey = publicKey
    } else {
      // Nếu chưa có, tạo mới TokenUser với publicKey
      tokenUser = this.tokenUserRepository.create({ user: { id: user.id }, publicKey })
    }
    // Cập nhật thời gian hết hạn của accessToken
    tokenUser.expired = new Date(Date.now() + ms(envConfig.ACCESS_TOKEN_EXPIRES_IN))
    return !!(await this.tokenUserRepository.save(tokenUser))
  }

  async getTokenUser(userId: string): Promise<TokenUser | null> {
    return this.tokenUserRepository.findOne({ where: { user: { id: userId } } })
  }
}
