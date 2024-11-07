import z from 'zod'
import { FullNameSchema } from '@/validations/CommonSchema'

export const FormCreateCategorySchema = z
  .object({
    name: FullNameSchema,
    description: z.string().default('')
  })
  .strict()
  .strip()

export type CreateCategoryType = z.infer<typeof FormCreateCategorySchema>
