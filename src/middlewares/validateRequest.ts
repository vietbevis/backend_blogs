import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodObject } from 'zod'
import { BadRequestError, InternalServerError } from '@/core/ErrorResponse'

interface ValidationSchemas {
  body?: ZodObject<any>
  query?: ZodObject<any>
  params?: ZodObject<any>
}

export function validateRequest({ body, query, params }: ValidationSchemas = {}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Nếu không có schema mà vẫn truyền dữ liệu, báo lỗi
    // if (!body && Object.keys(req.body).length > 0) {
    //   throw new BadRequestError('Invalid extra fields in body')
    // }

    // if (!query && Object.keys(req.query).length > 0) {
    //   throw new BadRequestError('Invalid extra fields in query')
    // }

    // if (!params && Object.keys(req.params).length > 0) {
    //   throw new BadRequestError('Invalid extra fields in params')
    // }

    try {
      // Validate body
      if (body) {
        const parsedBody = body.parse(req.body)
        req.body = parsedBody
      }

      // Validate query
      if (query) {
        const parsedQuery = query.parse(req.query)
        req.query = parsedQuery
      }

      // Validate params
      if (params) {
        const parsedParams = params.parse(req.params)
        req.params = parsedParams
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // if (
        //   error.issues.some(
        //     (issue) => issue.code === ZodIssueCode.unrecognized_keys
        //   )
        // ) {
        //   throw new BadRequestError('Invalid extra fields')
        // }

        const errorMessages: { field: string; message: string }[] = []

        error.issues.forEach((issue) => {
          const field = issue.path.join('.')
          const existingError = errorMessages.find((error) => error.field === field)

          if (existingError) {
            existingError.message += `\n ${issue.message}`
          } else {
            errorMessages.push({
              field,
              message: issue.message
            })
          }
        })

        throw new BadRequestError('Validation error', errorMessages)
      }

      throw new InternalServerError()
    }

    next()
  }
}
