import _ from 'lodash'

const selectFields = (data: any, fields: string[]) => {
  return _.pick(data, fields)
}

const omitFields = (data: any, fields: string[]) => {
  return _.omit(data, fields)
}

export { selectFields, omitFields }
