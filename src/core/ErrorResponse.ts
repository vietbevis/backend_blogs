import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import formatDate from '@/utils/formatDate'

class ErrorResponse extends Error {
  status: number
  details?: any
  timestamp: string = formatDate(new Date())

  constructor(message: string, status: number, details?: any) {
    super(message)
    this.status = status
    this.details = details
    this.name = this.constructor.name
  }
}

// Các lớp cụ thể cho từng loại lỗi
class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.NOT_FOUND, details?: any) {
    super(message, StatusCodes.NOT_FOUND, details)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.BAD_REQUEST, details?: any) {
    super(message, StatusCodes.BAD_REQUEST, details)
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED, details?: any) {
    super(message, StatusCodes.UNAUTHORIZED, details)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.FORBIDDEN, details?: any) {
    super(message, StatusCodes.FORBIDDEN, details)
  }
}

class MethodNotAllowedError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.METHOD_NOT_ALLOWED, details?: any) {
    super(message, StatusCodes.METHOD_NOT_ALLOWED, details)
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR, details?: any) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, details)
  }
}

export { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, InternalServerError, MethodNotAllowedError }
