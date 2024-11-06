import { z } from 'zod'
import { emailSchema, fullNameSchema, passwordSchema } from '@/validations/CommonSchema'

export const FormRegisterSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema
  })
  .strict() // Bắt buộc phải có các field được định nghĩa trong schema
  .strip() // Loại bỏ các field không được định nghĩa trong schema
export type RegisterBodyType = z.infer<typeof FormRegisterSchema>

export const FormLoginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema
  })
  .strict()
  .strip()
export type LoginBodyType = z.infer<typeof FormLoginSchema>

export const FormRefreshTokenSchema = z
  .object({
    refreshToken: z.string({ message: 'RefreshToken can not be blank' })
  })
  .strict()
  .strip()
export type RefreshTokenBodyType = z.infer<typeof FormRefreshTokenSchema>
