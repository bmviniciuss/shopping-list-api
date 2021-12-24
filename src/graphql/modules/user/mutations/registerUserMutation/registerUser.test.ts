import { PrismaClient } from '.prisma/client'

import { gql } from 'apollo-server-express'

import { makeApolloServer } from '../../../../../shared/infra/graphql/setupGraphqlServer'
import { NexusGenFieldTypes, NexusGenInputs } from '../../../../../../generated/nexus'

import faker from 'faker'

import userFactory from '../../../../../../tests/entities/factories/userFactory'

const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    RegisterUser(input: $input) {
      id
      email
      name
    }
  }
`

const makeValidInput = (): NexusGenInputs['RegisterUserInput'] => {
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
    const server = makeApolloServer(prisma)
    const variables = makeValidInput()
    const result = await server.executeOperation({
      query: REGISTER_USER_MUTATION,
      variables: { input: variables }
    })
    console.log(result)
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    const user = result!.data!.RegisterUser as NexusGenFieldTypes['Mutation']['RegisterUser']
    expect(user!.email).toEqual(variables.email)
  })

  it('should not allow a user register to register with same email', async () => {
    const existingUser = await prisma.user.create({
      data: userFactory(1)
    })
    const server = makeApolloServer(prisma)
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
    console.log(result)
    expect(result.errors).toBeDefined()
    expect(result.errors).toMatchInlineSnapshot(`
      Array [
        [GraphQLError: The received email is already in use.],
      ]
      `)
  })
})
