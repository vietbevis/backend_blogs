import express from 'express'
import UserController from '@/controllers/UserController'
import asyncHandler from '@/middlewares/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { FormChangePasswordSchema, FormUpdateUserSchema } from '@/validations/UserSchema'
import { ParamsIdSchema } from '@/validations/CommonSchema'

// Private route
const UserRouter = express.Router()
UserRouter.get('/me', asyncHandler(UserController.getMe))
UserRouter.post('/logout', asyncHandler(UserController.logout))
UserRouter.put('/update-me', validateRequest({ body: FormUpdateUserSchema }), asyncHandler(UserController.updateMe))
UserRouter.put(
  '/change-password',
  validateRequest({ body: FormChangePasswordSchema }),
  asyncHandler(UserController.changePassword)
)

// Public route
const PublicUserRouter = express.Router()
PublicUserRouter.get('/:id', validateRequest({ params: ParamsIdSchema }), asyncHandler(UserController.getUser))

// Export
export { UserRouter, PublicUserRouter }
