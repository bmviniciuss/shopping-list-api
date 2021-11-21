import {
  makeSchema as nexusMakeSchema
} from 'nexus'
import path from 'path'

import * as typeDefs from './modules'

export function makeSchema () {
  const schema = nexusMakeSchema({
    types: [typeDefs],
    outputs: {
      schema: path.join(__dirname, '/../../generated/schema.graphql'),
      typegen: path.join(__dirname, '/../../generated/nexus.ts')
    }
  })
  return schema
}
