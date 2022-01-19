import { idArg, nonNull, queryField } from 'nexus'

import { CategoryNexus } from '../..'
import { AppServerContext } from '../../../../../shared/infra/graphql/setupGraphqlServer'

export const GetCategoryByIdQuery = queryField('GetCategoryById', {
  type: CategoryNexus,
  args: {
    id: nonNull(idArg())
  },
  resolve (_root, data, context: AppServerContext) {
    if (!context?.currentUser) return null
    return context.prisma.category.findFirst({
      where: {
        id: data.id,
        createdBy: {
          id: context.currentUser.id
        }
      }
    })
  }
})
