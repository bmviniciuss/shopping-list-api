import { queryField } from 'nexus'

import { PrismaUserRepository } from '../../../../module/users/repos/implementations/PrismaUserRepository'
import { AppServerContext } from '../../../../shared/infra/graphql/setupGraphqlServer'
import { UserNexus } from '../types'

export const meQuery = queryField('me', {
  type: UserNexus,
  resolve (_root, _data, context: AppServerContext) {
    if (!context?.currentUser) return null
    const userRepo = new PrismaUserRepository(context.prisma)
    return userRepo.loadById(context.currentUser.id)
  }
})
