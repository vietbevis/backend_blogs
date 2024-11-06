import 'reflect-metadata'
import envConfig from '@/config/envConfig'
import { AppDataSource } from '@/config/database'
import app from '@/app'
import { DataSource } from 'typeorm'
import { Role } from '@/models/Role'
import { ERole } from '@/utils/constants'

AppDataSource.initialize()
  .then(async () => {
    await InitDataSource(AppDataSource)
    app.listen(envConfig.PORT, () => {
      console.log('Server is running on port 4000')
    })
  })
  .catch((error) => console.log(error))

const InitDataSource = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role)
  const [existsRoleUser, existsRoleAdmin] = await Promise.all([
    roleRepository.findOne({ where: { name: ERole.ROLE_USER } }),
    roleRepository.findOne({ where: { name: ERole.ROLE_ADMIN } })
  ])

  if (!existsRoleUser) {
    const roleUser = roleRepository.create({ name: ERole.ROLE_USER })
    await roleRepository.save(roleUser)
    console.log('Inserted role: ', ERole.ROLE_USER)
  }

  if (!existsRoleAdmin) {
    const roleAdmin = roleRepository.create({ name: ERole.ROLE_ADMIN })
    await roleRepository.save(roleAdmin)
    console.log('Inserted role: ', ERole.ROLE_ADMIN)
  }
}
