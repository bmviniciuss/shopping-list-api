import { PrismaClient } from '.prisma/client'

import { PORT } from '../../../config/env'
import { setupGraphqlServer } from '../graphql/setupGraphqlServer'
import { makeExpressApp } from './config/makeExpressApp'

async function bootstrap () {
  const prisma = new PrismaClient()
  const app = makeExpressApp()
  setupGraphqlServer(app, prisma)

  app.listen({ port: PORT }, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`)
  })
}

bootstrap()
