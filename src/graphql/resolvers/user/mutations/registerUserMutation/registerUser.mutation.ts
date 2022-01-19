
import { UserObject } from '../..'
import { BcryptAdapter } from '../../../../../module/cryptography/implementations/BcryptAdapter'
import { PrismaUserRepository } from '../../../../../module/users/repos/implementations/PrismaUserRepository'
import { RegisterUser } from '../../../../../module/users/useCases/registerUser/RegisterUser'
import { builder } from '../../../../builder'

export const RegisterUserMutationInput = builder.inputType('RegisterUserMutationInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    passwordConfirmation: t.string({ required: true })
  })
})

export const RegisterUserMutation = builder.mutationField('RegisterUser', (t) => {
  return t.field({
    type: UserObject,
    nullable: true,
    args: {
      input: t.arg({ type: RegisterUserMutationInput, required: true })
    },
    resolve: async (_root, data, { prisma }) => {
      const userRepository = new PrismaUserRepository(prisma)
      const hash = new BcryptAdapter(10)
      const useCase = new RegisterUser(userRepository, hash)
      const result = await useCase.execute(data.input)
      if (result.isLeft()) throw result.value
      return result.value
    }
  })
})
