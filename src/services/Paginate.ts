import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'
import { omitFields } from '@/utils/dtos'

export interface PaginationOptions {
  page: number
  limit: number
  order?: { [key: string]: 'ASC' | 'DESC' }
  filter?: { [key: string]: any }
}

export interface PaginatedResult<T> {
  items: T[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: PaginationOptions,
  fieldsToOmit: (keyof T)[] = []
): Promise<PaginatedResult<T>> {
  const { page, limit, order, filter } = options

  // Khởi tạo query builder với điều kiện lọc và sắp xếp
  let queryBuilder: SelectQueryBuilder<T> = repository.createQueryBuilder('entity')

  // Thêm điều kiện lọc nếu có
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      queryBuilder = queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value })
    })
  }

  // Thêm điều kiện sắp xếp nếu có
  if (order) {
    Object.entries(order).forEach(([key, direction]) => {
      queryBuilder = queryBuilder.addOrderBy(`entity.${key}`, direction)
    })
  }

  // Phân trang bằng offset và limit
  const offset = (page - 1) * limit
  queryBuilder = queryBuilder.skip(offset).take(limit)

  // Thực hiện truy vấn
  const [data, total] = await queryBuilder.getManyAndCount()

  // Tính toán giá trị hasNextPage và hasPreviousPage
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    page,
    limit,
    totalItems: total,
    totalPages,
    itemsPerPage: data.length,
    hasNextPage,
    hasPreviousPage,
    items: data.map((item) => omitFields(item, fieldsToOmit))
  }
}

export default paginate
