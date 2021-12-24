import { PrismaClient } from '.prisma/client'

import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { Express } from 'express'

import { makeSchema } from '../../../graphql/schema'

export type AppServerContext = {
 prisma: PrismaClient
}

export function getServerContext (expressContext: ExpressContext, prisma: PrismaClient): AppServerContext {
  return { prisma }
}

export function makeApolloServer (prisma: PrismaClient) {
  const schema = makeSchema()
  return new ApolloServer({
    schema: schema,
    context: (expressContext) => getServerContext(expressContext, prisma)
  })
}

export async function setupGraphqlServer (app: Express, prisma: PrismaClient) {
  const apolloServer = makeApolloServer(prisma)
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}
