import express from 'express'
import UserController from '@/controllers/UserController'
import asyncHandler from '@/middlewares/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { FormChangePasswordSchema, FormUpdateUserSchema, ParamsUserSchema } from '@/validations/UserSchema'

// Private route
const UserRouter = express.Router()
UserRouter.get('/me', asyncHandler(UserController.getMe))
UserRouter.post('/logout', asyncHandler(UserController.logout))
UserRouter.post('/update-me', validateRequest({ body: FormUpdateUserSchema }), asyncHandler(UserController.updateMe))
UserRouter.post(
  '/change-password',
  validateRequest({ body: FormChangePasswordSchema }),
  asyncHandler(UserController.changePassword)
)

// Public route
const PublicUserRouter = express.Router()
PublicUserRouter.get('/:userId', validateRequest({ params: ParamsUserSchema }), asyncHandler(UserController.getUser))

// Export
export { UserRouter, PublicUserRouter }
