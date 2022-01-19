import { CategoryObject } from '..'

import { builder } from '../../../builder'

export const GetCategoriesQuery = builder.queryField('GetCategories', (t) => {
  return t.field({
    type: [CategoryObject],
    nullable: {
      list: true,
      items: false
    },
    resolve: (_root, _data, { prisma, currentUser }) => {
      if (!currentUser) return null
      return prisma.category.findMany({
        where: {
          createdBy: {
            id: currentUser.id
          }
        }
      })
    }
  })
})
