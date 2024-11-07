import express from 'express'
import AuthRouter from '@/routes/v1/AuthRoute'
import { PublicUserRouter, UserRouter } from '@/routes/v1/UserRoute'
import asyncHandler from '@/middlewares/asyncHandler'
import AuthMiddleware from '@/middlewares/authMiddleware'
import { CategoryRouter, PublicCategoryRouter } from '@/routes/v1/CategoryRoute'
import { ERole } from '@/utils/constants'

const routes_v1 = express.Router()

// Public route
routes_v1.use('/auth', AuthRouter)
routes_v1.use('/public/users', PublicUserRouter)
routes_v1.use('/public/categories', PublicCategoryRouter)

// Private route
routes_v1.use(asyncHandler(AuthMiddleware.isAuthenticated))
routes_v1.use('/users', UserRouter)

// Admin route
routes_v1.use(asyncHandler(AuthMiddleware.authorizeRole([ERole.ROLE_ADMIN])))
routes_v1.use('/categories', CategoryRouter)

export default routes_v1
