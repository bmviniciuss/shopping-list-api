import { objectType } from 'nexus'

import { UserNexus } from '../..'
import { AppServerContext } from '../../../../shared/infra/graphql/setupGraphqlServer'

export const CategoryNexus = objectType({
  name: 'Category',
  definition (t) {
    t.nonNull.id('id')
    t.nonNull.string('name')
    t.string('description')
    t.nonNull.boolean('active')
    t.field('createdBy', {
      type: UserNexus,
      async resolve (root, _data, { prisma }: AppServerContext) {
        const category = await prisma.category.findUnique({
          where: { id: root.id },
          include: { createdBy: true }
        })
        if (!category?.createdBy) return null
        return category.createdBy
      }
    })
  }
})
