import 'reflect-metadata'
import envConfig from '@/config/envConfig'
import { AppDataSource } from '@/config/database'
import app from '@/app'
import { DataSource } from 'typeorm'
import { Role } from '@/models/Role'
import { ERole } from '@/utils/constants'
import autoRemoveTokenJob from '@/jobs/autoRemoveToken'
import { User } from '@/models/User'
import { hashPassword } from '@/utils/crypto'
import { InitMinio } from '@/config/minio'
import logger from '@/config/logger'
import getSlug from '@/utils/slug'

AppDataSource.initialize()
  .then(async () => {
    await InitDataSource(AppDataSource)
    await InitMinio()
    autoRemoveTokenJob()
    app.listen(envConfig.PORT, () => {
      logger.info('Server is running on port ' + envConfig.PORT)
    })
  })
  .catch((error) => console.log(error))

const InitDataSource = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role)
  const userRepository = dataSource.getRepository(User)
  const PHONE_NUMBER = '0793302880'
  const EMAIL = 'admin@admin.com'
  const PASSWORD = 'Admin@123456'
  const FULL_NAME = 'Admin'
  const [existsRoleUser, existsRoleAdmin, existsAccountAdmin] = await Promise.all([
    roleRepository.findOne({ where: { name: ERole.ROLE_USER } }),
    roleRepository.findOne({ where: { name: ERole.ROLE_ADMIN } }),
    userRepository.findOneBy({ email: 'admin@admin.com' })
  ])

  if (!existsRoleUser) {
    const roleUser = roleRepository.create({ name: ERole.ROLE_USER })
    await roleRepository.save(roleUser)
    logger.info('Inserted role: ', ERole.ROLE_USER)
  }

  if (!existsRoleAdmin) {
    const roleAdmin = roleRepository.create({ name: ERole.ROLE_ADMIN })
    const resultRoleAdmin = await roleRepository.save(roleAdmin)
    logger.info('Inserted role: ', ERole.ROLE_ADMIN)
  }

  if (!existsAccountAdmin) {
    const roles = await roleRepository
      .createQueryBuilder('role')
      .where('role.name IN (:...names)', { names: [ERole.ROLE_ADMIN] })
      .getMany()
    const accountAdmin = userRepository.create({
      fullName: FULL_NAME,
      email: EMAIL,
      password: await hashPassword(PASSWORD),
      phoneNumber: PHONE_NUMBER,
      username: getSlug(FULL_NAME),
      roles
    })
    await userRepository.save(accountAdmin)
    logger.info('Inserted account: ', ERole.ROLE_ADMIN)
  }
}
