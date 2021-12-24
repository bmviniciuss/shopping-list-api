import { arg, inputObjectType, mutationField, nonNull } from 'nexus'

import { BcryptAdapter } from '../../../../../module/cryptography/implementations/BcryptAdapter'
import { PrismaUserRepository } from '../../../../../module/users/repos/implementations/PrismaUserRepository'
import { RegisterUser } from '../../../../../module/users/useCases/registerUser/RegisterUser'
import { AppServerContext } from '../../../../../shared/infra/graphql/setupGraphqlServer'
import { UserNexus } from '../../types'

export const RegisterUserMutationInput = inputObjectType({
  name: 'RegisterUserInput',
  definition (t) {
    t.nonNull.string('name')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('passwordConfirmation')
  }
})

export const RegisterUserMutation = mutationField('RegisterUser', {
  type: UserNexus,
  args: {
    input: nonNull(arg({
      type: RegisterUserMutationInput
    }))
  },
  async resolve (_root, data, { prisma }: AppServerContext) {
    const userRepository = new PrismaUserRepository(prisma)
    const hash = new BcryptAdapter(10)
    const useCase = new RegisterUser(userRepository, hash)
    const result = await useCase.execute(data.input)
    if (result.isLeft()) throw result.value
    return result.value
  }
})
