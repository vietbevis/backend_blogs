import { Repository } from 'typeorm'
import { User } from '@/models/User'
import { AppDataSource } from '@/config/database'
import { Role } from '@/models/Role'
import { LoginBodyType, RegisterBodyType } from '@/validations/AuthSchema'
import { BadRequestError, UnauthorizedError } from '@/core/ErrorResponse'
import { ERole, TokenType } from '@/utils/constants'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { TokenService, UserFromTokenPayload } from '@/services/TokenService'

interface LoginResponse {
  access_token: string
  refresh_token: string
}

const tokenService = new TokenService()

export class AuthService {
  private userRepository: Repository<User> = AppDataSource.getRepository(User)
  private roleRepository: Repository<Role> = AppDataSource.getRepository(Role)

  async registerUser(body: RegisterBodyType): Promise<User> {
    const { fullName, email, password } = body
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } })
    if (existingUser) throw new BadRequestError('Email already exists')

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Find roles
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name IN (:...names)', { names: [ERole.ROLE_USER] })
      .getMany()

    // if (roles.length !== body.roleNames.length) {
    //   throw new BadRequestError('One or more roles not found');
    // }

    // Create new user
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
      roles
    })

    // Save the user
    await this.userRepository.save(newUser)

    return newUser
  }

  async loginUser(body: LoginBodyType): Promise<LoginResponse> {
    const { email, password } = body

    // Check user
    const existingUser = await this.userRepository.findOne({
      where: { email },
      relations: { roles: true }
    })
    if (existingUser == null) throw new BadRequestError('User not found')

    // Check password
    if (!(await comparePassword(password, existingUser.password))) throw new BadRequestError('Passwords do not match')

    // Generate token
    const [access_token, refresh_token] = await Promise.all([
      tokenService.generateToken(existingUser, TokenType.ACCESS_TOKEN),
      tokenService.generateToken(existingUser, TokenType.REFRESH_TOKEN)
    ])

    // Save refresh token to db
    await tokenService.saveRefreshToken(existingUser, refresh_token)

    return { access_token, refresh_token }
  }

  async refreshToken(refresh_token: string, user: UserFromTokenPayload): Promise<LoginResponse> {
    const tokenValid = await tokenService.verifyToken(refresh_token, TokenType.REFRESH_TOKEN)
    if (!tokenValid) throw new UnauthorizedError()

    const access_token = await tokenService.generateToken(user, TokenType.ACCESS_TOKEN)

    return { access_token, refresh_token }
  }
}
