import { NextFunction, Request, RequestHandler, Response } from 'express'

const asyncHandler = (fn: any): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
