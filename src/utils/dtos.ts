import _ from 'lodash'

const selectFields = (data: any, fields: string[]) => {
  return _.pick(data, fields)
}

const omitFields = (data: any, fields: string[]) => {
  return _.omit(data, fields)
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

export { selectFields, omitFields }
