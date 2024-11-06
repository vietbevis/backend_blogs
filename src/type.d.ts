import { UserFromTokenPayload } from '@/services/TokenService'

declare module 'express-serve-static-core' {
  interface Request {
    user: UserFromTokenPayload
  }
}
