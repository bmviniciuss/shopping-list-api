import { arg, inputObjectType, mutationField, nonNull } from 'nexus'

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
  type: 'Boolean',
  args: {
    input: nonNull(arg({
      type: RegisterUserMutationInput
    }))
  },
  resolve (_root, data) {
    console.log(data)
    return true
  }
})
