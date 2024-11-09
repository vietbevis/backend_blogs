import slugify from 'slugify'
import { randomUUID } from 'crypto'

function getSlug(str: string): string {
  const newStr = slugify(str, {
    lower: true,
    strict: true,
    locale: 'vi'
  })
  return newStr + '-' + randomUUID().replace(/-/g, '')
}

export default getSlug
