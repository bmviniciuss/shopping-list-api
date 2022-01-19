import { list, nonNull, queryField } from 'nexus'

import { CategoryNexus } from '../..'
import { AppServerContext } from '../../../../../shared/infra/graphql/setupGraphqlServer'

export const getCategoriesQuery = queryField('GetCategories', {
  type: list(nonNull(CategoryNexus)),
  resolve (_root, _data, context: AppServerContext) {
    if (!context?.currentUser) return null
    return context.prisma.category.findMany({
      where: {
        createdBy: {
          id: context.currentUser.id
        }
      }
    })
  }
})
