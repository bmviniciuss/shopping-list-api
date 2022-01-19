import fs from 'fs'
import { printSchema, lexicographicSortSchema } from 'graphql'
import path from 'path'

import { builder } from './builder'
import './resolvers'

export const schema = builder.toSchema({})

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'dev') {
  const schemaAsString = printSchema(lexicographicSortSchema(schema))

  fs.writeFileSync(
    path.join(process.cwd(), 'src/graphql/schema.gql'),
    schemaAsString
  )
}
