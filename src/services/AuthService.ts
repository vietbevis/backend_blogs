import { Repository } from 'typeorm'
import { User } from '@/models/User'
import { AppDataSource } from '@/config/database'
import { Role } from '@/models/Role'
import { LoginBodyType, RegisterBodyType } from '@/validations/AuthSchema'
import { BadRequestError, UnauthorizedError } from '@/core/ErrorResponse'
import { ERole } from '@/utils/constants'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { TokenService, UserFromTokenPayload } from '@/services/TokenService'
import MESSAGES from '@/utils/message'

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

const tokenService = new TokenService()

export class AuthService {
  private userRepository: Repository<User> = AppDataSource.getRepository(User)
  private roleRepository: Repository<Role> = AppDataSource.getRepository(Role)

  async registerUser(body: RegisterBodyType): Promise<User> {
    const { fullName, email, password } = body
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } })
    if (existingUser) throw new BadRequestError(MESSAGES.ERROR.EMAIL.ALREADY_EXISTS)

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
    if (existingUser == null) throw new BadRequestError(MESSAGES.ERROR.EMAIL.NOT_FOUND)

    // Check password
    if (!(await comparePassword(password, existingUser.password)))
      throw new BadRequestError(MESSAGES.ERROR.PASSWORD.NOT_MATCH)

    // Generate token
    const { accessToken, refreshToken, publicKey } = await tokenService.generateToken(existingUser)

    return { accessToken, refreshToken }
  }

  async refreshToken(refreshTokenOld: string, user: UserFromTokenPayload): Promise<LoginResponse> {
    const tokenExists = await tokenService.getTokenUser(user.id)

    const tokenValid = await tokenService.verifyToken(refreshTokenOld)
    if (!tokenValid) throw new UnauthorizedError()

    const { accessToken, refreshToken, publicKey } = await tokenService.generateToken(user)

    return { accessToken, refreshToken }
  }
}
