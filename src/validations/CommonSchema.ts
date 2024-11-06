import { Pagination } from '@/utils/constants'
import z from 'zod'

export const emailSchema = z.string({ message: 'Email can not be blank' }).email({
  message: 'Invalid email address.'
})

export const passwordSchema = z
  .string({ message: 'Password can not be blank' })
  .min(8, {
    message: 'Password must be at least 8 characters.'
  })
  .max(20, { message: 'Password must be at most 20 characters.' })
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,20}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
  })

export const fullNameSchema = z
  .string({ message: 'Fullname can not be blank' })
  .min(3, { message: 'Name must be at least 3 characters.' })
  .max(20, { message: 'Name must not exceed 20 characters.' })

export const phoneNumberSchema = z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
  message: 'Phone number is invalid (Viet Nam phone number only).'
})

const PaginationSchema = z
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
    sortDirection: z.enum(['asc', 'desc']).default('desc')
  })
  .strict()
  .strip()

export type PaginationType = z.infer<typeof PaginationSchema>
export default PaginationSchema