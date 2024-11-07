import { RequestHandler } from 'express'
import { UserService } from '@/services/UserService'
import { ChangePasswordType, UpdateUserType } from '@/validations/UserSchema'
import { OkResponse } from '@/core/SuccessResponse'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/core/ErrorResponse'
import { omitFields } from '@/utils/dtos'
import MESSAGES from '@/utils/message'
import { ParamsIdType } from '@/validations/CommonSchema'

interface UserController {
  getUser: RequestHandler<ParamsIdType>
  getMe: RequestHandler
  logout: RequestHandler
  changePassword: RequestHandler<unknown, unknown, ChangePasswordType>
  updateMe: RequestHandler<unknown, unknown, UpdateUserType>
}

const userService = new UserService()

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
  }
}

export default UserController
