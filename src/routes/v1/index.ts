import express from 'express'
import AuthRouter from '@/routes/v1/AuthRoute'

const routes_v1 = express.Router()

// Public route
routes_v1.use('/auth', AuthRouter)

// Private route

export default routes_v1
