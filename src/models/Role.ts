import { BaseModel } from '@/models/BaseModel'
import { Column, Entity } from 'typeorm'
import { ERole } from '@/utils/constants'

@Entity('roles')
export class Role extends BaseModel {
  @Column({ type: 'enum', enum: ERole, unique: true })
  name!: string
}
