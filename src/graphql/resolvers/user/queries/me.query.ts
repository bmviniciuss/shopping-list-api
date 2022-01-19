
import { PrismaUserRepository } from '../../../../module/users/repos/implementations/PrismaUserRepository'
import { builder } from '../../../builder'
import { UserObject } from '../types/user.type'

builder.queryField('me', (t) => {
  return t.field({
    type: UserObject,
    nullable: true,
    resolve: (_root, _data, context) => {
      if (!context?.currentUser) return null
      const userRepo = new PrismaUserRepository(context.prisma)
      return userRepo.loadById(context.currentUser.id)
    }
  })
})
