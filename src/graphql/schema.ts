import fs from 'fs'
import { printSchema, lexicographicSortSchema } from 'graphql'
import path from 'path'

import { builder } from './builder'

import './resolvers'

export const schema = builder.toSchema({})

if (process.env.NODE_ENV === 'dev') {
  const schemaAsString = printSchema(lexicographicSortSchema(schema))

  const generatedFolderPath = path.join(process.cwd(), 'generated')
  const schemaPath = path.join(generatedFolderPath, 'schema.graphql')

  if (!fs.existsSync(generatedFolderPath)) {
    fs.mkdirSync(generatedFolderPath)
  }
  fs.writeFileSync(schemaPath, schemaAsString)
}
