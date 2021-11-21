import {
  makeSchema as nexusMakeSchema
} from 'nexus'
import path from 'path'

export function makeSchema () {
  const schema = nexusMakeSchema({
    types: [],
    outputs: {
      schema: path.join(__dirname, '/../../generated/schema.graphql'),
      typegen: path.join(__dirname, '/../../generated/nexus.ts')
    }
  })
  return schema
}
