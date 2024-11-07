import { Column, Entity } from 'typeorm'
import { BaseModel } from '@/models/BaseModel'

@Entity('categories')
export class Category extends BaseModel {
  @Column({ type: 'nvarchar', name: 'name', unique: true })
  name!: string

  @Column({ type: 'text', name: 'description', nullable: true })
  description!: string

  @Column({ type: 'bit', default: true })
  active!: boolean
}
