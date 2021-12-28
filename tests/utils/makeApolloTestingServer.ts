import { PrismaClient, User } from '.prisma/client'

import { ApolloServer } from 'apollo-server-express'

import { makeSchema } from '../../src/graphql/schema'
import { AppServerContext, AppServerContextGetter } from '../../src/shared/infra/graphql/setupGraphqlServer'

export function makeApolloTestingServer (prisma: PrismaClient, contextGetter: AppServerContextGetter) {
  const schema = makeSchema()
  return new ApolloServer({
    schema: schema,
    context: () => {
      return contextGetter.getAppContext()
    }
  })
}

export class IntegrationTestingContext implements AppServerContextGetter {
  constructor (private readonly prisma: PrismaClient, private readonly currentUser: User | null) {}
  getAppContext (): Promise<AppServerContext> {
    return Promise.resolve({ prisma: this.prisma, currentUser: this.currentUser })
  }
}
