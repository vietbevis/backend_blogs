import express from 'express'
import CategoryController from '@/controllers/CategoryController'
import { validateRequest } from '@/middlewares/validateRequest'
import { PaginationSchema, ParamsIdSchema } from '@/validations/CommonSchema'
import asyncHandler from '@/middlewares/asyncHandler'
import { FormCreateCategorySchema } from '@/validations/CategorySchema'

const PublicCategoryRouter = express.Router()
PublicCategoryRouter.get(
  '/',
  validateRequest({ query: PaginationSchema }),
  asyncHandler(CategoryController.getAllCategories)
)
PublicCategoryRouter.get(
  '/:id',
  validateRequest({ params: ParamsIdSchema }),
  asyncHandler(CategoryController.getCategoryById)
)

const CategoryRouter = express.Router()
CategoryRouter.get(
  '/soft',
  validateRequest({ query: PaginationSchema }),
  asyncHandler(CategoryController.getAllCategoriesSoftDelete)
)
CategoryRouter.post(
  '/',
  validateRequest({ body: FormCreateCategorySchema }),
  asyncHandler(CategoryController.createCategory)
)
CategoryRouter.put(
  '/:id',
  validateRequest({ params: ParamsIdSchema, body: FormCreateCategorySchema }),
  asyncHandler(CategoryController.updateCategory)
)
CategoryRouter.delete(
  '/:id',
  validateRequest({ params: ParamsIdSchema, body: FormCreateCategorySchema }),
  asyncHandler(CategoryController.deleteCategory)
)
CategoryRouter.delete(
  '/soft/:id',
  validateRequest({ params: ParamsIdSchema, body: FormCreateCategorySchema }),
  asyncHandler(CategoryController.softDeleteCategory)
)

export { CategoryRouter, PublicCategoryRouter }
