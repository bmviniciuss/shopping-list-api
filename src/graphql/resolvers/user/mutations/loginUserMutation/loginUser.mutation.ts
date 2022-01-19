import { UserObject } from '../..'
import { JWT_SECRET } from '../../../../../config/env'
import { BcryptAdapter } from '../../../../../module/cryptography/implementations/BcryptAdapter'
import { JwtAdapter } from '../../../../../module/cryptography/implementations/JwtAdapter'
import { PrismaUserRepository } from '../../../../../module/users/repos/implementations/PrismaUserRepository'
import { LoginUser } from '../../../../../module/users/useCases/login/LoginUser'
import { builder } from '../../../../builder'

export const LoginUserMutationInput = builder.inputType('LoginUserInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true })
  })
})

export const LoginUserResult = builder.simpleObject('LoginUserResult', {
  fields: (t) => ({
    user: t.field({ type: UserObject, nullable: false }),
    accessToken: t.string({ nullable: false })
  })
})

export const LoginUserMutation = builder.mutationField('LoginUser', (t) => {
  return t.field({
    type: LoginUserResult,
    nullable: true,
    args: {
      input: t.arg({ type: LoginUserMutationInput, required: true })
    },
    resolve: async (_root, data, { prisma }) => {
      const userRepository = new PrismaUserRepository(prisma)
      const hasher = new BcryptAdapter(10)
      const jwt = new JwtAdapter(JWT_SECRET)
      const useCase = new LoginUser(userRepository, hasher, jwt)
      const result = await useCase.execute(data.input)
      if (result.isLeft()) throw result.value
      return result.value
    }
  })
})
