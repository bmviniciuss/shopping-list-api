import { PrismaClient } from '.prisma/client'

import { gql } from 'apollo-server-express'
import faker from 'faker'

import userFactory from '../../../../../../tests/entities/factories/userFactory'
import {
  IntegrationTestingContext,
  makeApolloTestingServer
} from '../../../../../../tests/utils/makeApolloTestingServer'

const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    RegisterUser(input: $input) {
      id
      email
      name
    }
  }
`

const makeValidInput = () => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password,
    passwordConfirmation: password
  }
}

describe('RegisterUserMutation', () => {
  let prisma: PrismaClient
  beforeAll(() => {
    prisma = new PrismaClient()
  })

  it('should register a user successfully', async () => {
    const server = makeApolloTestingServer(prisma, new IntegrationTestingContext(prisma, null))
    const variables = makeValidInput()
    const result = await server.executeOperation({
      query: REGISTER_USER_MUTATION,
      variables: { input: variables }
    })
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    const user = result!.data!.RegisterUser
    expect(user!.email).toEqual(variables.email)
  })

  it('should not allow a user register to register with same email', async () => {
    const existingUser = await prisma.user.create({
      data: userFactory(1)
    })
    const server = makeApolloTestingServer(prisma, new IntegrationTestingContext(prisma, null))
    const variables = makeValidInput()
    const result = await server.executeOperation({
      query: REGISTER_USER_MUTATION,
      variables: {
        input: {
          ...variables,
          email: existingUser.email
        }
      }
    })
    expect(result.errors).toBeDefined()
    expect(result.errors).toMatchInlineSnapshot(`
      Array [
        [GraphQLError: The received email is already in use.],
      ]
      `)
  })
})
