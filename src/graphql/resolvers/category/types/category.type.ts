import { Category } from '@prisma/client'

import { UserObject } from '../..'
import { builder } from '../../../builder'

export const CategoryObject = builder.objectRef<Category>('Category').implement({
  description: 'A user from the system',
  fields: (t) => ({
    id: t.exposeID('id', {
      nullable: false
    }),
    name: t.exposeString('name', {
      nullable: false
    }),
    description: t.exposeString('description', {
      nullable: true
    }),
    active: t.exposeBoolean('active'),
    createdBy: t.field({
      type: UserObject,
      nullable: true,
      resolve: async (root, _data, { prisma }) => {
        const category = await prisma.category.findUnique({
          where: { id: root.id },
          include: { createdBy: true }
        })
        if (!category?.createdBy) return null
        return category.createdBy
      }
    })
  })
})
