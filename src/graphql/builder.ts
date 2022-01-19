import SchemaBuilder from '@giraphql/core'
import SimpleObjectsPlugin from '@giraphql/plugin-simple-objects'

import { AppServerContext } from '../shared/infra/graphql/setupGraphqlServer'

export const builder = new SchemaBuilder<{
  Context: AppServerContext
}>({
  plugins: [SimpleObjectsPlugin]
})

builder.queryType({
  fields: t => ({
    _q: t.string({
      resolve: () => 'Hello'
    })
  })
})

builder.mutationType({
  fields: t => ({
    _m: t.string({
      resolve: () => 'Hello'
    })
  })
})
