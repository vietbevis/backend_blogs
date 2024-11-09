import { Not, Repository } from 'typeorm'
import { Category } from '@/models/Category'
import { AppDataSource } from '@/config/database'
import paginate, { PaginatedResult, PaginationOptions } from '@/services/Paginate'
import { CreateCategoryType } from '@/validations/CategorySchema'
import { BadRequestError, NotFoundError } from '@/core/ErrorResponse'
import MESSAGES from '@/utils/message'
import getSlug from '@/utils/slug'
import { mapValues } from '@/utils/dtos'

export class CategoryService {
  private categoryRepository: Repository<Category> = AppDataSource.getRepository(Category)

  async getAll(options: PaginationOptions): Promise<PaginatedResult<Category>> {
    return paginate(this.categoryRepository, options, ['active'])
  }

  async create(category: CreateCategoryType): Promise<Category> {
    const categoryExists = await this.categoryRepository.findOneBy({ name: category.name })
    if (categoryExists) throw new BadRequestError(MESSAGES.ERROR.CATEGORY.EXISTS)

    const newCategory = this.categoryRepository.create({
      ...category,
      slug: getSlug(category.name)
    })
    return this.categoryRepository.save(newCategory)
  }

  async getById(id: string): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id })
  }

  async update(id: string, categoryData: CreateCategoryType): Promise<Category> {
    const slug = getSlug(categoryData.name)

    const [existingCategory, duplicateCategory] = await Promise.all([
      this.categoryRepository.findOneBy({ id }),
      this.categoryRepository.findOne({
        where: [
          { name: categoryData.name, id: Not(id) },
          { slug: slug, id: Not(id) }
        ]
      })
    ])

    if (!existingCategory) throw new NotFoundError(MESSAGES.ERROR.CATEGORY.NOT_FOUND)
    if (duplicateCategory) throw new BadRequestError(MESSAGES.ERROR.CATEGORY.EXISTS)

    return this.categoryRepository.save(mapValues(categoryData, existingCategory))
  }

  async softDelete(id: string): Promise<void> {
    await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ active: () => '!active' })
      .where('id = :id', { id })
      .execute()
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.createQueryBuilder().delete().from(Category).where('id = :id', { id }).execute()
  }
}
