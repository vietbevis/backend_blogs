import { BaseModel } from '@/models/BaseModel'
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm'
import { User } from '@/models/User'

@Entity('token_users')
export class TokenUser extends BaseModel {
  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user!: Relation<User>

  @Column({ type: 'longtext', name: 'refreshToken' })
  refreshToken!: string
}
