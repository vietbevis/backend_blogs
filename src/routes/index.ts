import { Express } from 'express'
import routes_v1 from './v1'

const PREFIX = '/api'

const routes = (app: Express) => {
  app.use(`${PREFIX}/v1`, routes_v1)
}

export default routes
