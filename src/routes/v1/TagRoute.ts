import express from 'express'
import { validateRequest } from '@/middlewares/validateRequest'
import { PaginationSchema, ParamsIdSchema, QueryDeleteSchema, QueryUserIdSchema } from '@/validations/CommonSchema'
import asyncHandler from '@/middlewares/asyncHandler'
import { FormCreateTagSchema } from '@/validations/TagSchema'
import TagController from '@/controllers/TagController'

const PublicTagRouter = express.Router()
PublicTagRouter.get('/', validateRequest({ query: QueryUserIdSchema }), asyncHandler(TagController.getAllTags))
PublicTagRouter.get('/:id', validateRequest({ params: ParamsIdSchema }), asyncHandler(TagController.getTagById))

const TagRouter = express.Router()
TagRouter.get('/soft', validateRequest({ query: PaginationSchema }), asyncHandler(TagController.getAllTagsSoftDelete))
TagRouter.post('/', validateRequest({ body: FormCreateTagSchema }), asyncHandler(TagController.createTag))
TagRouter.put(
  '/:id',
  validateRequest({ params: ParamsIdSchema, body: FormCreateTagSchema }),
  asyncHandler(TagController.updateTag)
)
TagRouter.delete(
  '/:id',
  validateRequest({ params: ParamsIdSchema, query: QueryDeleteSchema }),
  asyncHandler(TagController.deleteTag)
)

export { TagRouter, PublicTagRouter }
