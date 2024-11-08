import { Repository } from 'typeorm'
import { User } from '@/models/User'
import { AppDataSource } from '@/config/database'
import { BadRequestError, UnauthorizedError } from '@/core/ErrorResponse'
import { UpdateUserType } from '@/validations/UserSchema'
import { compareSync } from 'bcryptjs'
import { hashPassword } from '@/utils/crypto'
import { TokenUser } from '@/models/TokenUser'
import MESSAGES from '@/utils/message'
import { mapValues } from '@/utils/dtos'

export class UserService {
  private userRepository: Repository<User> = AppDataSource.getRepository(User)
  private tokenUserRepository: Repository<TokenUser> = AppDataSource.getRepository(TokenUser)

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id })
  }

  async logout(userId: string): Promise<void> {
    const tokenUser = await this.tokenUserRepository.findOne({ where: { user: { id: userId } } })
    if (!tokenUser) return
    await this.tokenUserRepository.remove(tokenUser)
  }

  async updateUser(userId: string, user: UpdateUserType): Promise<User> {
    const userExists = await this.userRepository.findOneBy({ id: userId })
    if (!userExists) throw new UnauthorizedError()
    return this.userRepository.save(mapValues(user, userExists))
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const userExists = await this.userRepository.findOneBy({ id: userId })
    if (!userExists) throw new UnauthorizedError()

    const comparePassword = compareSync(newPassword, userExists.password)
    if (comparePassword) throw new BadRequestError(MESSAGES.ERROR.PASSWORD.NEW_PASSWORD)

    userExists.password = await hashPassword(newPassword)

    await this.userRepository.save(userExists)
  }
}
