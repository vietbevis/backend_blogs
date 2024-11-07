enum ERole {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER'
}

const enum Pagination {
  PAGE = 1,
  LIMIT = 24
}

enum ESort {
  ASC = 'ASC',
  DESC = 'DESC'
}

const enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}

const KEY = {
  COOKIE: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken'
  },
  HEADER: {
    AUTHORIZATION: 'Authorization'
  }
}

export { ERole, Pagination, TokenType, KEY, ESort }
