import { DELETE_TYPE, ESort, FOLLOW_TYPE, Pagination } from '@/utils/constants'
import z from 'zod'

export const EmailSchema = z.string({ message: 'Email can not be blank' }).email({
  message: 'Invalid email address.'
})

export const PasswordSchema = z
  .string({ message: 'Password can not be blank' })
  .min(8, {
    message: 'Password must be at least 8 characters.'
  })
  .max(20, { message: 'Password must be at most 20 characters.' })
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,20}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
  })

export const FullNameSchema = z
  .string({ message: 'Name can not be blank' })
  .min(3, { message: 'Name must be at least 3 characters.' })
  .max(20, { message: 'Name must not exceed 20 characters.' })

export const phoneNumberSchema = z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
  message: 'Phone number is invalid (Viet Nam phone number only).'
})

export const PaginationSchema = z
  .object({
    page: z
      .string()
      .default(Pagination.PAGE.toString())
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Page must be a positive number'
      })
      .transform((val) => Number(val)),
    limit: z
      .string()
      .default(Pagination.LIMIT.toString())
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Limit must be a positive number'
      })
      .transform((val) => Number(val)),
    sortField: z.string().default('createdAt'),
    sortDirection: z.nativeEnum(ESort).default(ESort.DESC)
  })
  .strict()
  .strip()

export type PaginationType = z.infer<typeof PaginationSchema>

export const QueryUserIdSchema = PaginationSchema.extend({
  userId: z.string().default('')
})
  .strict()
  .strip()

export type QueryUserIdType = z.infer<typeof QueryUserIdSchema>

export const QueryFollowSchema = QueryUserIdSchema.extend({
  followType: z.nativeEnum(FOLLOW_TYPE)
})
  .strict()
  .strip()

export type QueryFollowType = z.infer<typeof QueryFollowSchema>

export const ParamsIdSchema = z
  .object({
    id: z.string({ message: 'UserId can not be blank' }).uuid('Invalid userId')
  })
  .strict()
  .strip()

export type ParamsIdType = z.infer<typeof ParamsIdSchema>

export const QueryDeleteSchema = z
  .object({
    deleteType: z.nativeEnum(DELETE_TYPE).default(DELETE_TYPE.SOFT_DELETE)
  })
  .strict()
  .strip()

export type QueryDeleteType = z.infer<typeof QueryDeleteSchema>
