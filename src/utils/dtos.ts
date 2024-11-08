import _ from 'lodash'
import { ObjectLiteral } from 'typeorm'

const selectFields = (data: any, fields: string[]) => {
  return _.pick(data, fields)
}

const omitFields = <T extends ObjectLiteral>(data: T, fields: (keyof T)[]): T => {
  return _.omit(data, fields) as T
}

function mapValues<T extends object>(source: Partial<T>, target: T): T {
  const result = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const value = source[key]
      if (value !== undefined) {
        ;(result as any)[key] = value
      }
    }
  }

  return result
}

export { selectFields, omitFields, mapValues }
