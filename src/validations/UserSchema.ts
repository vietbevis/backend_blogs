import z from 'zod'
import { FormRegisterSchema } from './AuthSchema'
import { FullNameSchema, PasswordSchema, phoneNumberSchema } from './CommonSchema'
import { ERole } from '@/utils/constants'

export const FormChangePasswordSchema = z
  .object({
    oldPassword: PasswordSchema,
    newPassword: PasswordSchema,
    confirmPassword: PasswordSchema
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
  phoneNumber: phoneNumberSchema.default(''),
  avatarUrl: z.string().default('')
})
  .strict()
  .strip()

export type CreateUserType = z.infer<typeof FormCreateUserSchema>

export const FormUpdateUserSchema = z
  .object({
    fullName: FullNameSchema,
    phoneNumber: phoneNumberSchema,
    avatarUrl: z.string().default('')
  })
  .strict()
  .strip()

export type UpdateUserType = z.infer<typeof FormUpdateUserSchema>
