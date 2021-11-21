import { PORT } from '../../../config/env'
import { setupGraphqlServer } from '../graphql/setupGraphqlServer'
import { makeExpressApp } from './config/makeExpressApp'

async function bootstrap () {
  const app = makeExpressApp()
  setupGraphqlServer(app)

  app.listen({ port: PORT }, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`)
  })
}

bootstrap()
