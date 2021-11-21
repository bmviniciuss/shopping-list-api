import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

import { makeSchema } from '../../../graphql/schema'

export function makeApolloServer () {
  const schema = makeSchema()
  return new ApolloServer({
    schema: schema
  })
}

export async function setupGraphqlServer (app: Express) {
  const apolloServer = makeApolloServer()
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}
