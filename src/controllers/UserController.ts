import { RequestHandler } from 'express'
import { UserService } from '@/services/UserService'
import { ChangePasswordType, UpdateUserType } from '@/validations/UserSchema'
import { OkResponse } from '@/core/SuccessResponse'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/core/ErrorResponse'
import { omitFields } from '@/utils/dtos'
import MESSAGES from '@/utils/message'
import { PaginationType, ParamsIdType, QueryFollowType } from '@/validations/CommonSchema'
import { TagService } from '@/services/TagService'

interface UserController {
  getUser: RequestHandler<ParamsIdType>
  getMe: RequestHandler
  getFollowUsers: RequestHandler<unknown, unknown, unknown, QueryFollowType>
  logout: RequestHandler
  changePassword: RequestHandler<unknown, unknown, ChangePasswordType>
  updateMe: RequestHandler<unknown, unknown, UpdateUserType>
  toggleFollowUser: RequestHandler<ParamsIdType>
  toggleFollowTag: RequestHandler<ParamsIdType>
  getTagsByUserId: RequestHandler<ParamsIdType, unknown, unknown, PaginationType>
}

const userService = new UserService()
const tagService = new TagService()

const UserController: UserController = {
  changePassword: async (req, res) => {
    if (req.body.newPassword !== req.body.confirmPassword)
      throw new BadRequestError(MESSAGES.ERROR.PASSWORD.CONFIRM_PASSWORD)
    await userService.changePassword(req.user.id, req.body.newPassword)
    new OkResponse(MESSAGES.SUCCESS.USER.CHANGE_PASSWORD).send(res)
  },
  getMe: async (req, res) => {
    const user = await userService.getUserById(req.user.id)
    if (!user) throw new UnauthorizedError()
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, omitFields(user, ['password', 'roles', 'active'])).send(res)
  },
  getFollowUsers: async (req, res) => {
    if (req.query.userId) {
      const result = await userService.getFollow(
        req.query.userId,
        omitFields(req.query, ['userId', 'followType']),
        [],
        req.query.followType
      )
      new OkResponse(MESSAGES.SUCCESS.COMPLETED, result).send(res)
    } else {
      throw new NotFoundError(MESSAGES.ERROR.EMAIL.NOT_FOUND)
    }
  },
  getUser: async (req, res) => {
    const user = await userService.getUserById(req.params.id)
    if (!user) throw new NotFoundError(MESSAGES.ERROR.EMAIL.NOT_FOUND)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, omitFields(user, ['password', 'roles', 'active'])).send(res)
  },
  logout: async (req, res) => {
    await userService.logout(req.user.id)
    new OkResponse(MESSAGES.SUCCESS.USER.LOGOUT).send(res)
  },
  updateMe: async (req, res) => {
    const userUpdated = await userService.updateUser(req.user.id, req.body)
    new OkResponse(MESSAGES.SUCCESS.USER.UPDATE, omitFields(userUpdated, ['password', 'roles', 'active'])).send(res)
  },
  toggleFollowUser: async (req, res) => {
    await userService.toggleFollowUser(req.user.id, req.params.id)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED).send(res)
  },
  toggleFollowTag: async (req, res) => {
    await userService.toggleFollowTag(req.user.id, req.params.id)
    new OkResponse(MESSAGES.SUCCESS.COMPLETED).send(res)
  },
  getTagsByUserId: async (req, res) => {
    const result = await tagService.getAll({
      ...req.query,
      filter: { followers: { id: req.params.id } }
    })
    new OkResponse(MESSAGES.SUCCESS.COMPLETED, result).send(res)
  }
}

export default UserController
