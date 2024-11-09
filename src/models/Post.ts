import { BaseModel } from '@/models/BaseModel'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { Tag } from '@/models/Tag'
import { Category } from '@/models/Category'
import { User } from '@/models/User'

@Entity('posts')
export class Post extends BaseModel {
  @Column({ type: 'nvarchar', name: 'title' })
  title!: string

  @Column({ type: 'varchar', name: 'thumbnails' })
  thumbnails!: string

  @Column({ type: 'varchar', name: 'slug', unique: true })
  slug!: string

  @Column({ type: 'text', name: 'short_description' })
  shortDescription!: string

  @Column({ type: 'text', name: 'content' })
  content!: string

  @Column({ type: 'int', name: 'countLike', default: 0 })
  countLike!: number

  @Column({ type: 'boolean', default: true })
  active!: boolean

  @ManyToOne(() => Category, (category) => category.posts, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category!: Category

  @ManyToOne(() => User, (user) => user.postsCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy!: User

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tags',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    }
  })
  tags!: Tag[]

  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable({
    name: 'user_likes_post',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    }
  })
  likedByUsers!: User[]
}
