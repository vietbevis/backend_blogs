import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { BaseModel } from '@/models/BaseModel'
import { Role } from '@/models/Role'
import { Tag } from '@/models/Tag'
import { Post } from '@/models/Post'

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

  @Column({ type: 'varchar', name: 'username', unique: true })
  username!: string

  @Column({ type: 'int', name: 'count_followers', default: 0 })
  countFollowers!: number

  @Column({ type: 'int', name: 'count_following', default: 0 })
  countFollowing!: number

  @Column({ type: 'int', name: 'count_following_tags', default: 0 })
  countFollowingTags!: number

  @Column({ type: 'boolean', default: true })
  active!: boolean

  @ManyToMany(() => Role)
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

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'user_followers',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'follower_id',
      referencedColumnName: 'id'
    }
  })
  followers!: User[]

  @ManyToMany(() => User, (user) => user.followers)
  following!: User[]

  @ManyToMany(() => Tag, (tag) => tag.followers)
  @JoinTable({
    name: 'user_follow_tags',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    }
  })
  followingTags!: Tag[]

  @ManyToMany(() => Post, (post) => post.likedByUsers)
  @JoinTable({
    name: 'user_likes_post',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id'
    }
  })
  likedPosts!: Post[]

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'user_saves_post',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id'
    }
  })
  savedPosts!: Post[]

  @OneToMany(() => Post, (post) => post.createdBy)
  postsCreated!: Post[]
}
