import { PrismaClient } from '.prisma/client'

import { gql } from 'apollo-server-express'

import { IntegrationTestingContext, makeApolloTestingServer } from '../../../../../tests/utils/makeApolloTestingServer'

const IS_ALIVE_QUERY = gql`
  query isAlive {
    isAlive
  }
`

describe('isAlive Query', () => {
  let prisma: PrismaClient
  beforeAll(() => {
    prisma = new PrismaClient()
  })

  it('should return true', async () => {
    const server = makeApolloTestingServer(prisma, new IntegrationTestingContext(prisma, null))
    const result = await server.executeOperation({
      query: IS_ALIVE_QUERY
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.isAlive).toEqual(true)
  })
})
