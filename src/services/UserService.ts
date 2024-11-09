import { EntityManager, Repository } from 'typeorm'
import { User } from '@/models/User'
import { AppDataSource } from '@/config/database'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/core/ErrorResponse'
import { UpdateUserType } from '@/validations/UserSchema'
import { compareSync } from 'bcryptjs'
import { hashPassword } from '@/utils/crypto'
import { TokenUser } from '@/models/TokenUser'
import MESSAGES from '@/utils/message'
import { mapValues, omitFields } from '@/utils/dtos'
import { Tag } from '@/models/Tag'
import paginate, { PaginationOptions } from '@/services/Paginate'
import { FOLLOW_TYPE } from '@/utils/constants'

export class UserService {
  private userRepository: Repository<User> = AppDataSource.getRepository(User)
  private tokenUserRepository: Repository<TokenUser> = AppDataSource.getRepository(TokenUser)
  private tagRepository: Repository<Tag> = AppDataSource.getRepository(Tag)
  private entityManager: EntityManager = AppDataSource.createEntityManager()

  async getFollow(
    userId: string,
    paginationOptions: PaginationOptions,
    fieldsToOmit: (keyof User)[] = [],
    relationField: FOLLOW_TYPE
  ) {
    return paginate(
      this.userRepository,
      {
        ...paginationOptions,
        relationField: relationField === FOLLOW_TYPE.FOLLOWERS ? FOLLOW_TYPE.FOLLOWING : FOLLOW_TYPE.FOLLOWERS,
        joinCondition: 'relation.id = :userId',
        joinParams: { userId }
      },
      fieldsToOmit
    )
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        followers: true,
        following: true,
        followingTags: true
      }
    })
    if (!user) return null

    user.followers = user.followers.slice(0, 5).map((follower) => omitFields(follower, ['active', 'password']))
    user.following = user.following.slice(0, 5).map((follow) => omitFields(follow, ['active', 'password']))
    user.followingTags = user.followingTags.slice(0, 5).map((tag) => omitFields(tag, ['active']))

    return user
  }

  async toggleFollowUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (currentUserId === targetUserId) throw new BadRequestError('Can not follow your self')

    return this.entityManager.transaction(async (transactionalEntityManager) => {
      const [currentUser, targetUser] = await Promise.all([
        transactionalEntityManager.findOne(User, {
          where: { id: currentUserId },
          relations: ['following']
        }),
        transactionalEntityManager.findOne(User, {
          where: { id: targetUserId },
          relations: ['followers']
        })
      ])

      if (!currentUser || !targetUser) throw new NotFoundError('User not found')

      const isFollowing = currentUser.following.some((user) => user.id === targetUserId)

      if (isFollowing) {
        // Unfollow
        currentUser.following = currentUser.following.filter((user) => user.id !== targetUserId)
        currentUser.countFollowing--
        targetUser.countFollowers--
      } else {
        // Follow
        currentUser.following.push(targetUser)
        currentUser.countFollowing++
        targetUser.countFollowers++
      }

      await Promise.all([transactionalEntityManager.save(currentUser), transactionalEntityManager.save(targetUser)])
    })
  }

  async toggleFollowTag(userId: string, tagId: string): Promise<void> {
    return this.entityManager.transaction(async (transactionalEntityManager) => {
      const [user, tag] = await Promise.all([
        transactionalEntityManager.findOne(User, {
          where: { id: userId },
          relations: ['followingTags']
        }),
        transactionalEntityManager.findOne(Tag, {
          where: { id: tagId }
        })
      ])

      if (!tag) throw new NotFoundError('Tag not found')
      if (!user) throw new NotFoundError('User not found')

      const isFollowing = user.followingTags.some((followedTag) => followedTag.id === tagId)

      if (isFollowing) {
        // Unfollow
        user.followingTags = user.followingTags.filter((followedTag) => followedTag.id !== tagId)
        user.countFollowingTags--
        tag.countFollowers--
      } else {
        // Follow
        user.followingTags.push(tag)
        user.countFollowingTags++
        tag.countFollowers++
      }

      await Promise.all([transactionalEntityManager.save(user), transactionalEntityManager.save(tag)])
    })
  }

  async logout(userId: string): Promise<void> {
    const tokenUser = await this.tokenUserRepository.findOne({ where: { user: { id: userId } } })
    if (!tokenUser) return
    await this.tokenUserRepository.remove(tokenUser)
  }

  async updateUser(userId: string, user: UpdateUserType): Promise<User> {
    const userExists = await this.userRepository.findOneBy({ id: userId })
    if (!userExists) throw new UnauthorizedError()
    return this.userRepository.save(mapValues(user, userExists))
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const userExists = await this.userRepository.findOneBy({ id: userId })
    if (!userExists) throw new UnauthorizedError()

    const comparePassword = compareSync(newPassword, userExists.password)
    if (comparePassword) throw new BadRequestError(MESSAGES.ERROR.PASSWORD.NEW_PASSWORD)

    userExists.password = await hashPassword(newPassword)

    await this.userRepository.save(userExists)
  }
}
