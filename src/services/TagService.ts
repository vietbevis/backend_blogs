import { Not, Repository } from 'typeorm'
import { Tag } from '@/models/Tag'
import { AppDataSource } from '@/config/database'
import paginate, { PaginatedResult, PaginationOptions } from '@/services/Paginate'
import { BadRequestError, NotFoundError } from '@/core/ErrorResponse'
import MESSAGES from '@/utils/message'
import getSlug from '@/utils/slug'
import { CreateTagType } from '@/validations/TagSchema'
import { mapValues } from '@/utils/dtos'
import { User } from '@/models/User'

export class TagService {
  private tagRepository: Repository<Tag> = AppDataSource.getRepository(Tag)
  private userRepository: Repository<User> = AppDataSource.getRepository(User)

  async getAll(options: PaginationOptions): Promise<PaginatedResult<Tag>> {
    return paginate(this.tagRepository, options, ['active'])
  }

  async getPaginatedTagsByUserId(
    userId: string,
    paginationOptions: PaginationOptions,
    fieldsToOmit: (keyof Tag)[] = []
  ): Promise<PaginatedResult<Tag>> {
    return paginate<Tag>(
      this.tagRepository,
      {
        ...paginationOptions,
        relationField: 'followers',
        joinCondition: 'relation.id = :userId',
        joinParams: { userId }
      },
      fieldsToOmit
    )
  }

  async create(tag: CreateTagType): Promise<Tag> {
    const tagExists = await this.tagRepository.findOneBy({ name: tag.name })
    if (tagExists) throw new BadRequestError(MESSAGES.ERROR.TAG.EXISTS)

    const newTag = this.tagRepository.create({
      ...tag,
      slug: getSlug(tag.name)
    })
    return this.tagRepository.save(newTag)
  }

  async getById(id: string): Promise<Tag | null> {
    return this.tagRepository.findOneBy({ id })
  }

  async update(id: string, tagData: CreateTagType): Promise<Tag> {
    const slug = getSlug(tagData.name)

    const [existingTag, duplicateTag] = await Promise.all([
      this.tagRepository.findOneBy({ id }),
      this.tagRepository.findOne({
        where: [
          { name: tagData.name, id: Not(id) },
          { slug: slug, id: Not(id) }
        ]
      })
    ])

    if (!existingTag) throw new NotFoundError(MESSAGES.ERROR.TAG.NOT_FOUND)
    if (duplicateTag) throw new BadRequestError(MESSAGES.ERROR.TAG.EXISTS)

    return this.tagRepository.save(mapValues(tagData, existingTag))
  }

  async softDelete(id: string): Promise<void> {
    await this.tagRepository
      .createQueryBuilder()
      .update(Tag)
      .set({ active: () => '!active' })
      .where('id = :id', { id })
      .execute()
  }

  async delete(id: string): Promise<void> {
    await this.tagRepository.createQueryBuilder().delete().from(Tag).where('id = :id', { id }).execute()
  }
}
