import { Repository } from 'typeorm'
import { User } from '@/models/User'
import { AppDataSource } from '@/config/database'

export class UserService {
  private userRepository: Repository<User> = AppDataSource.getRepository(User)

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find()
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email })
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData)
    return this.userRepository.save(user)
  }
}
