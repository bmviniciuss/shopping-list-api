import { PrismaClient } from '.prisma/client'

import { gql } from 'apollo-server-express'

import { makeApolloServer } from '../../../../../shared/infra/graphql/setupGraphqlServer'
import { NexusGenFieldTypes } from '../../../../../../generated/nexus'

import faker from 'faker'

import userFactory from '../../../../../../tests/entities/factories/userFactory'
import { BcryptAdapter } from '../../../../../module/cryptography/implementations/BcryptAdapter'

const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($input: LoginUserInput!) {
    LoginUser(input: $input) {
      user {
        id
        email
        name
        active
      }
      accessToken
    }
  }
`

describe('RegisterUserMutation', () => {
  let prisma: PrismaClient
  beforeAll(() => {
    prisma = new PrismaClient()
  })

  it('should login a user successfully', async () => {
    const hasher = new BcryptAdapter(10)
    const password = faker.internet.password()
    const hashedPassword = await hasher.hash(password)
    const user = await prisma.user.create({ data: userFactory(1, { password: hashedPassword }) })

    const server = makeApolloServer(prisma)
    const result = await server.executeOperation({
      query: LOGIN_USER_MUTATION,
      variables: {
        input: {
          email: user.email,
          password
        }
      }
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()

    const data = result!.data!.LoginUser as NexusGenFieldTypes['Mutation']['LoginUser']
    expect(data!.user.email).toEqual(user.email)
    expect(data!.accessToken).toBeDefined()
  })

  it('should return an error if user does not exists', async () => {
    const server = makeApolloServer(prisma)
    const result = await server.executeOperation({
      query: LOGIN_USER_MUTATION,
      variables: {
        input: {
          email: faker.internet.email(),
          password: faker.internet.password()
        }
      }
    })
    expect(result.errors).toBeDefined()
    expect(result.errors).toMatchInlineSnapshot(`
      Array [
        [GraphQLError: The received email or password is invalid],
      ]
      `)
  })
})
