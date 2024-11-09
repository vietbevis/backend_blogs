import z from 'zod'
import { FullNameSchema } from '@/validations/CommonSchema'

export const FormCreateTagSchema = z
  .object({
    name: FullNameSchema,
    description: z.string().default('')
  })
  .strict()
  .strip()

export type CreateTagType = z.infer<typeof FormCreateTagSchema>
