import { PrismaClient, User } from '.prisma/client'

import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { Express } from 'express'

import { makeSchema } from '../../../graphql/schema'
import { getToken } from '../../utils/getToken'
import { JwtAdapter } from '../../../module/cryptography/implementations/JwtAdapter'
import { JWT_SECRET } from '../../../config/env'
import { PrismaUserRepository } from '../../../module/users/repos/implementations/PrismaUserRepository'

export type AppServerContext = {
 prisma: PrismaClient
  currentUser: User | null
}

export async function getServerContext ({ req }: ExpressContext, prisma: PrismaClient): Promise<AppServerContext> {
  const unauthorizedContext: AppServerContext = { prisma, currentUser: null }

  const token = getToken(req.get('Authorization'))
  if (!token) return unauthorizedContext

  const jwtAdapter = new JwtAdapter(JWT_SECRET)
  const decodedToken = await jwtAdapter.decrypt(token)

  if (!decodedToken?.sub) return unauthorizedContext
  const { sub } = decodedToken

  const userRepository = new PrismaUserRepository(prisma)
  const user = await userRepository.loadById(sub)

  if (!user) return unauthorizedContext

  return { prisma, currentUser: user }
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
