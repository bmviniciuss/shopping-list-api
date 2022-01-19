import { CategoryObject } from '..'

import { builder } from '../../../builder'

export const GetCategoryByIdQuery = builder.queryField('GetCategoryById', (t) => {
  return t.field({
    type: CategoryObject,
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_root, data, { prisma, currentUser }) => {
      if (!currentUser) return null
      return prisma.category.findFirst({
        where: {
          id: data.id as string,
          createdBy: {
            id: currentUser.id
          }
        }
      })
    }
  })
})
