import express from 'express'
import AuthRouter from '@/routes/v1/AuthRoute'
import { PublicUserRouter, UserRouter } from '@/routes/v1/UserRoute'
import asyncHandler from '@/middlewares/asyncHandler'
import AuthMiddleware from '@/middlewares/authMiddleware'
import { CategoryRouter, PublicCategoryRouter } from '@/routes/v1/CategoryRoute'
import { ERole } from '@/utils/constants'
import UploadFileRouter from '@/routes/v1/UploadFileRouter'
import { PublicTagRouter, TagRouter } from '@/routes/v1/TagRoute'

const routes_v1 = express.Router()

// Public route
routes_v1.use('/auth', AuthRouter)
routes_v1.use('/public/users', PublicUserRouter)
routes_v1.use('/public/categories', PublicCategoryRouter)
routes_v1.use('/public/tags', PublicTagRouter)

// Private route
routes_v1.use(asyncHandler(AuthMiddleware.isAuthenticated))
routes_v1.use('/users', UserRouter)
routes_v1.use('/uploads', UploadFileRouter)

// Admin route
routes_v1.use(asyncHandler(AuthMiddleware.authorizeRole([ERole.ROLE_ADMIN])))
routes_v1.use('/categories', CategoryRouter)
routes_v1.use('/tags', TagRouter)

export default routes_v1
