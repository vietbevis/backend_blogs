import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseModel } from '@/models/BaseModel'
import { User } from '@/models/User'
import { Post } from '@/models/Post'

@Entity('tags')
export class Tag extends BaseModel {
  @Column({ type: 'nvarchar', name: 'name', unique: true })
  name!: string

  @Column({ type: 'varchar', name: 'slug', unique: true })
  slug!: string

  @Column({ type: 'text', name: 'description', nullable: true })
  description!: string

  @Column({ type: 'boolean', default: true })
  active!: boolean

  @Column({ type: 'int', name: 'count_followers', default: 0 })
  countFollowers!: number

  @ManyToMany(() => User, (user) => user.followingTags)
  @JoinTable({
    name: 'user_follow_tags',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    }
  })
  followers!: User[]

  @ManyToMany(() => Post, (post) => post.tags)
  @JoinTable({
    name: 'post_tags',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id'
    }
  })
  posts!: Post[]
}
