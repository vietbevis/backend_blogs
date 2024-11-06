import { DataSource } from 'typeorm'
import { User } from '@/models/User'
import envConfig from './envConfig'
import { Role } from '@/models/Role'
import { TokenUser } from '@/models/TokenUser'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USER_NAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Role, TokenUser],
  subscribers: [],
  migrations: []
})
