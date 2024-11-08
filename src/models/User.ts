import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseModel } from '@/models/BaseModel'
import { Role } from '@/models/Role'

@Entity('users')
export class User extends BaseModel {
  @Column({ type: 'nvarchar', name: 'full_name' })
  fullName!: string

  @Column({ type: 'varchar', name: 'email', unique: true })
  email!: string

  @Column({ type: 'varchar', name: 'password' })
  password!: string

  @Column({ type: 'varchar', name: 'avatar_url', default: '' })
  avatarUrl!: string

  @Column({ type: 'varchar', name: 'phone_number', default: '' })
  phoneNumber!: string

  @Column({ type: 'bit', default: true })
  active!: boolean

  @ManyToMany(() => Role, { nullable: false })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles!: Role[]
}
