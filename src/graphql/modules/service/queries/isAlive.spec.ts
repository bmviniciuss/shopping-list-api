import { gql } from 'apollo-server-express'

import { makeApolloServer } from '../../../../shared/infra/graphql/setupGraphqlServer'

const IS_ALIVE_QUERY = gql`
  query isAlive {
    isAlive
  }
`

describe('isAlive Query', () => {
  it('should return true', async () => {
    const server = makeApolloServer()
    const result = await server.executeOperation({
      query: IS_ALIVE_QUERY
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.isAlive).toEqual(true)
  })
})
