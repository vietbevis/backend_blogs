import { Not, Repository } from 'typeorm'
import { Category } from '@/models/Category'
import { AppDataSource } from '@/config/database'
import paginate, { PaginatedResult, PaginationOptions } from '@/services/Paginate'
import { CreateCategoryType } from '@/validations/CategorySchema'
import { BadRequestError, NotFoundError } from '@/core/ErrorResponse'
import MESSAGES from '@/utils/message'

export class CategoryService {
  private categoryRepository: Repository<Category> = AppDataSource.getRepository(Category)

  async getAll(options: PaginationOptions): Promise<PaginatedResult<Category>> {
    return paginate(this.categoryRepository, options, ['active'])
  }

  async create(category: CreateCategoryType): Promise<Category> {
    const categoryExists = await this.categoryRepository.findOneBy({ name: category.name })
    if (categoryExists) throw new BadRequestError(MESSAGES.ERROR.CATEGORY.EXISTS)

    const newCategory = this.categoryRepository.create(category)
    return this.categoryRepository.save(newCategory)
  }

  async getById(id: string): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id })
  }

  async update(id: string, category: CreateCategoryType): Promise<Category> {
    const categoryExists = await this.categoryRepository.findOneBy({ id })
    if (!categoryExists) throw new NotFoundError(MESSAGES.ERROR.CATEGORY.NOT_FOUND)

    const categoryNameExists = await this.categoryRepository.findOne({
      where: {
        name: category.name,
        id: Not(id)
      }
    })
    if (categoryNameExists) throw new BadRequestError(MESSAGES.ERROR.CATEGORY.EXISTS)

    categoryExists.name = category.name
    categoryExists.description = category.description || ''

    return this.categoryRepository.save(categoryExists)
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
