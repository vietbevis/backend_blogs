import express from 'express'
import AuthRouter from '@/routes/v1/AuthRoute'
import { PublicUserRouter, UserRouter } from '@/routes/v1/UserRoute'
import asyncHandler from '@/middlewares/asyncHandler'
import AuthMiddleware from '@/middlewares/authMiddleware'

const routes_v1 = express.Router()

// Public route
routes_v1.use('/auth', AuthRouter)
routes_v1.use('/public/users', PublicUserRouter)

// Private route
routes_v1.use(asyncHandler(AuthMiddleware.isAuthenticated))
routes_v1.use('/users', UserRouter)

export default routes_v1
