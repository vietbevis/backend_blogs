import { RequestHandler } from 'express'
import { CreatedResponse, OkResponse } from '@/core/SuccessResponse'
import { CategoryService } from '@/services/CategoryService'
import { PaginationType, ParamsIdType } from '@/validations/CommonSchema'
import { CreateCategoryType } from '@/validations/CategorySchema'
import MESSAGES from '@/utils/message'
import { NotFoundError } from '@/core/ErrorResponse'
import { omitFields } from '@/utils/dtos'

interface CategoryController {
  getAllCategories: RequestHandler<unknown, unknown, unknown, PaginationType>
  getAllCategoriesSoftDelete: RequestHandler<unknown, unknown, unknown, PaginationType>
  getCategoryById: RequestHandler<ParamsIdType>
  createCategory: RequestHandler<unknown, unknown, CreateCategoryType>
  updateCategory: RequestHandler<ParamsIdType>
  deleteCategory: RequestHandler<ParamsIdType>
  softDeleteCategory: RequestHandler<ParamsIdType>
}

const categoryService = new CategoryService()

const CategoryController: CategoryController = {
  createCategory: async (req, res) => {
    const result = await categoryService.create(req.body)
    new CreatedResponse(MESSAGES.SUCCESS.CATEGORY.CREATE, omitFields(result, ['active'])).send(res)
  },
  deleteCategory: async (req, res) => {
    await categoryService.delete(req.params.id)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED).send(res)
  },
  softDeleteCategory: async (req, res) => {
    await categoryService.softDelete(req.params.id)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED).send(res)
  },
  getAllCategories: async (req, res) => {
    const result = await categoryService.getAll({
      page: req.query.page,
      limit: req.query.limit,
      filter: {
        active: true
      }
    })
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, result).send(res)
  },
  getAllCategoriesSoftDelete: async (req, res) => {
    const result = await categoryService.getAll({
      page: req.query.page,
      limit: req.query.limit,
      filter: {
        active: false
      }
    })
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, result).send(res)
  },
  getCategoryById: async (req, res) => {
    const category = await categoryService.getById(req.params.id)
    if (!category) throw new NotFoundError(MESSAGES.ERROR.CATEGORY.NOT_FOUND)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, omitFields(category, ['active'])).send(res)
  },
  updateCategory: async (req, res) => {
    const result = await categoryService.update(req.params.id, req.body)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, omitFields(result, ['active'])).send(res)
  }
}

export default CategoryController
