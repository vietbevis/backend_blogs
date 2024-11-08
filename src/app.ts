import morgan from 'morgan'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from './config/cors'
import formatDate from '@/utils/formatDate'
import routes from '@/routes'
import { initFolder } from '@/utils/file'

const app = express()

// Tự động tạo folder uploads ảnh nếu chưa tồn tại
initFolder()

// Middleware
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
routes(app)

// Handling errors
app.use((_req, res, _next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    code: StatusCodes.NOT_FOUND,
    status: 'error',
    message: 'Invalid route (not found).',
    timestamp: formatDate(new Date())
  })
})

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const errorMessage = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
  const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR
  const details = error.details || undefined
  res.status(statusCode).json({
    code: statusCode,
    status: 'error',
    message: errorMessage,
    details,
    timestamp: formatDate(new Date())
  })
})

export default app
