
import { CategoryObject } from '..'

import { PrismaCategoryRepository } from '../../../../module/category/repos/implementation/PrismaCategoryRepository'
import { CreateCategory } from '../../../../module/category/useCases/createCategory/CreateCategory'
import { builder } from '../../../builder'

export const CreateCategoryInput = builder.inputType('CreateCategoryInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: false })
  })
})

export const CreateCategoryMutation = builder.mutationField('CreateCategory', (t) => {
  return t.field({
    type: CategoryObject,
    args: {
      input: t.arg({ type: CreateCategoryInput, required: true })
    },
    resolve: async (_root, data, { currentUser, prisma }) => {
      if (!currentUser) throw new Error('Precisa de user')
      const categoryRepository = new PrismaCategoryRepository(prisma)
      const useCase = new CreateCategory(currentUser, categoryRepository)

      const result = await useCase.execute(data.input)
      if (result.isLeft()) throw result.value
      return result.value
    }
  })
})
