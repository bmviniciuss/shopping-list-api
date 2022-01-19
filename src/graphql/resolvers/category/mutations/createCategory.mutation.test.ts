import { PrismaClient } from '.prisma/client'

import { gql } from 'apollo-server-express'
import faker from 'faker'

import userFactory from '../../../../../tests/entities/factories/userFactory'
import { makeApolloTestingServer, IntegrationTestingContext } from '../../../../../tests/utils/makeApolloTestingServer'

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    CreateCategory(input: $input) {
      id
      name
      description
    }
  }
`

const makeValidInput = () => {
  return {
    name: faker.random.words(),
    description: faker.random.words()
  }
}

describe('CreateCategoryMutation', () => {
  let prisma: PrismaClient
  beforeAll(() => {
    prisma = new PrismaClient()
  })

  afterEach(async () => {
    await prisma.category.deleteMany({})
    await prisma.user.deleteMany({})
  })

  it('should create a category on success', async () => {
    const userLogged = await prisma.user.create({ data: userFactory(1) })
    const server = makeApolloTestingServer(prisma,
      new IntegrationTestingContext(prisma, userLogged))
    const variables = makeValidInput()
    const result = await server.executeOperation({
      query: CREATE_CATEGORY_MUTATION,
      variables: { input: variables }
    })

    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.CreateCategory?.id).toBeDefined()
    expect(result.data?.CreateCategory?.name).toEqual(variables.name)
    expect(result.data?.CreateCategory?.description).toEqual(variables.description)
  })
})
