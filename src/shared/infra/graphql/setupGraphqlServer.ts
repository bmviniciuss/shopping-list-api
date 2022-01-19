import { PrismaClient, User } from '.prisma/client'

import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { Express } from 'express'

import { getToken } from '../../utils/getToken'
import { JwtAdapter } from '../../../module/cryptography/implementations/JwtAdapter'
import { JWT_SECRET } from '../../../config/env'
import { PrismaUserRepository } from '../../../module/users/repos/implementations/PrismaUserRepository'
import { schema } from '../../../graphql/schema'

export type AppServerContext = {
  prisma: PrismaClient
  currentUser: User | null
}

export interface AppServerContextGetter {
  getAppContext: () => Promise<AppServerContext>
}

class GetContext implements AppServerContextGetter {
  constructor (private readonly expressContext: ExpressContext, private readonly prisma: PrismaClient) { }

  async getAppContext (): Promise<AppServerContext> {
    const unauthorizedContext:AppServerContext = { prisma: this.prisma, currentUser: null }
    const token = getToken(this.expressContext.req.get('Authorization'))
    console.log('TOKEN: ', token)

    if (!token) return unauthorizedContext

    const jwtAdapter = new JwtAdapter(JWT_SECRET)
    const decodedToken = await jwtAdapter.decrypt(token)
    console.log('decodedToken: ', decodedToken)

    if (!decodedToken?.sub) return unauthorizedContext
    const { sub } = decodedToken

    const userRepository = new PrismaUserRepository(this.prisma)
    const user = await userRepository.loadById(sub)

    if (!user) return unauthorizedContext

    return {
      prisma: this.prisma,
      currentUser: user
    }
  }
}

export function makeApolloServer (prisma: PrismaClient) {
  return new ApolloServer({
    schema: schema,
    context: (expressContext) => {
      const contextGetter = new GetContext(expressContext, prisma)
      return contextGetter.getAppContext()
    }
  })
}

export async function setupGraphqlServer (app: Express, prisma: PrismaClient) {
  const apolloServer = makeApolloServer(prisma)
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}
