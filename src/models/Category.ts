import { Column, Entity, OneToMany } from 'typeorm'
import { BaseModel } from '@/models/BaseModel'
import { Post } from '@/models/Post'

@Entity('categories')
export class Category extends BaseModel {
  @Column({ type: 'nvarchar', name: 'name', unique: true })
  name!: string

  @Column({ type: 'varchar', name: 'slug', unique: true })
  slug!: string

  @Column({ type: 'text', name: 'description', nullable: true })
  description!: string

  @Column({ type: 'boolean', default: true })
  active!: boolean

  @OneToMany(() => Post, (post) => post.category)
  posts!: Post[]
}
