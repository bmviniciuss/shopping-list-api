import { arg, inputObjectType, mutationField, nonNull, objectType } from 'nexus'

import { JWT_SECRET } from '../../../../../config/env'
import { BcryptAdapter } from '../../../../../module/cryptography/implementations/BcryptAdapter'
import { JwtAdapter } from '../../../../../module/cryptography/implementations/JwtAdapter'
import { PrismaUserRepository } from '../../../../../module/users/repos/implementations/PrismaUserRepository'
import { LoginUser } from '../../../../../module/users/useCases/login/LoginUser'
import { AppServerContext } from '../../../../../shared/infra/graphql/setupGraphqlServer'
import { UserNexus } from '../../types'

export const LoginUserMutationInput = inputObjectType({
  name: 'LoginUserInput',
  definition (t) {
    t.nonNull.string('email')
    t.nonNull.string('password')
  }
})

export const LoginUserResult = objectType({
  name: 'LoginUserResult',
  definition (t) {
    t.nonNull.field('user', { type: UserNexus })
    t.nonNull.string('accessToken')
  }
})

export const LoginUserMutation = mutationField('LoginUser', {
  type: LoginUserResult,
  args: {
    input: nonNull(arg({
      type: LoginUserMutationInput
    }))
  },
  async resolve (_root, data, { prisma }: AppServerContext) {
    const userRepository = new PrismaUserRepository(prisma)
    const hasher = new BcryptAdapter(10)
    const jwt = new JwtAdapter(JWT_SECRET)
    const useCase = new LoginUser(userRepository, hasher, jwt)
    const result = await useCase.execute(data.input)
    if (result.isLeft()) throw result.value
    return result.value
  }
})
