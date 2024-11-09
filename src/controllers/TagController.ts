import { RequestHandler } from 'express'
import { CreatedResponse, OkResponse } from '@/core/SuccessResponse'
import { TagService } from '@/services/TagService'
import { PaginationType, ParamsIdType, QueryDeleteType, QueryUserIdType } from '@/validations/CommonSchema'
import { CreateTagType } from '@/validations/TagSchema'
import MESSAGES from '@/utils/message'
import { NotFoundError } from '@/core/ErrorResponse'
import { omitFields } from '@/utils/dtos'
import { DELETE_TYPE } from '@/utils/constants'

interface TagController {
  getAllTags: RequestHandler<unknown, unknown, unknown, QueryUserIdType>
  getAllTagsSoftDelete: RequestHandler<unknown, unknown, unknown, PaginationType>
  getTagById: RequestHandler<ParamsIdType>
  createTag: RequestHandler<unknown, unknown, CreateTagType>
  updateTag: RequestHandler<ParamsIdType>
  deleteTag: RequestHandler<ParamsIdType, unknown, unknown, QueryDeleteType>
}

const tagService = new TagService()

const TagController: TagController = {
  createTag: async (req, res) => {
    const result = await tagService.create(req.body)
    new CreatedResponse(MESSAGES.SUCCESS.TAG.CREATE, omitFields(result, [])).send(res)
  },
  deleteTag: async (req, res) => {
    if (req.query.deleteType === DELETE_TYPE.SOFT_DELETE) {
      await tagService.softDelete(req.params.id)
    } else {
      await tagService.delete(req.params.id)
    }
    new OkResponse(MESSAGES.SUCCESS.COMPLETED).send(res)
  },
  getAllTags: async (req, res) => {
    if (req.query.userId) {
      const result = await tagService.getPaginatedTagsByUserId(req.query.userId, omitFields(req.query, ['userId']))
      new OkResponse(MESSAGES.SUCCESS.COMPLETED, result).send(res)
    } else {
      const result = await tagService.getAll({
        filter: { active: true },
        ...req.query
      })
      new OkResponse(MESSAGES.SUCCESS.COMPLETED, result).send(res)
    }
  },
  getAllTagsSoftDelete: async (req, res) => {
    const result = await tagService.getAll({
      page: req.query.page,
      limit: req.query.limit,
      filter: {
        active: false
      }
    })
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, result).send(res)
  },
  getTagById: async (req, res) => {
    const tag = await tagService.getById(req.params.id)
    if (!tag) throw new NotFoundError(MESSAGES.ERROR.TAG.NOT_FOUND)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, omitFields(tag, [])).send(res)
  },
  updateTag: async (req, res) => {
    const result = await tagService.update(req.params.id, req.body)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, omitFields(result, [])).send(res)
  }
}

export default TagController
