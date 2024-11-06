enum ERole {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER'
}

const enum Pagination {
  PAGE = 1,
  LIMIT = 24
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
    AUTHORIZATION: 'Authorization',
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id'
  }
}

export { ERole, Pagination, TokenType, KEY }
