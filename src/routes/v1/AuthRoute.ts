import express from 'express'
import asyncHandler from '@/middlewares/asyncHandler'
import { FormLoginSchema, FormRefreshTokenSchema, FormRegisterSchema } from '@/validations/AuthSchema'
import { validateRequest } from '@/middlewares/validateRequest'
import { AuthController } from '@/controllers/AuthController'
import AuthMiddleware from '@/middlewares/authMiddleware'

const AuthRouter = express.Router()

AuthRouter.post('/login', validateRequest({ body: FormLoginSchema }), asyncHandler(AuthController.login))

AuthRouter.post('/register', validateRequest({ body: FormRegisterSchema }), asyncHandler(AuthController.register))

AuthRouter.post(
  '/refresh',
  asyncHandler(AuthMiddleware.isAuthenticated),
  validateRequest({ body: FormRefreshTokenSchema }),
  asyncHandler(AuthController.refresh)
)

export default AuthRouter
