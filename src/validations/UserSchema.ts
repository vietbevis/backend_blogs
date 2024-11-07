import z from 'zod'
import { FormRegisterSchema } from './AuthSchema'
import { fullNameSchema, passwordSchema, phoneNumberSchema } from './CommonSchema'
import { ERole } from '@/utils/constants'

export const FormChangePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema
  })
  .strict()
  .strip()
// .refine((data) => data.newPassword === data.confirmPassword, {
//   message: 'Confirm password must match new password.',
//   path: ['confirmPassword']
// })
// .refine((data) => data.oldPassword !== data.newPassword, {
//   message: 'New password must be different from old password.',
//   path: ['newPassword']
// })

export type ChangePasswordType = z.infer<typeof FormChangePasswordSchema>

export const FormCreateUserSchema = FormRegisterSchema.extend({
  roles: z
    .array(z.nativeEnum(ERole))
    .min(1, { message: 'Roles can not be blank' })
    .default([ERole.ROLE_USER])
    .optional(),
  phoneNumber: phoneNumberSchema.default('').optional()
})
  .strict()
  .strip()

export type CreateUserType = z.infer<typeof FormCreateUserSchema>

export const FormUpdateUserSchema = z
  .object({
    fullName: fullNameSchema,
    phoneNumber: phoneNumberSchema
  })
  .strict()
  .strip()

export type UpdateUserType = z.infer<typeof FormUpdateUserSchema>

export const ParamsUserSchema = z
  .object({
    userId: z.string({ message: 'UserId can not be blank' }).uuid('Invalid userId')
  })
  .strict()
  .strip()

export type ParamsUserType = z.infer<typeof ParamsUserSchema>
