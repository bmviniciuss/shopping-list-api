import { arg, inputObjectType, mutationField, nonNull } from 'nexus'

import { PrismaCategoryRepository } from '../../../../../module/category/repos/implementation/PrismaCategoryRepository'
import { CreateCategory } from '../../../../../module/category/useCases/createCategory/CreateCategory'
import { AppServerContext } from '../../../../../shared/infra/graphql/setupGraphqlServer'
import { CategoryNexus } from '../../types'

export const CreateCategoryMutationInput = inputObjectType({
  name: 'CreateCategoryInput',
  definition (t) {
    t.nonNull.string('name')
    t.string('description')
  }
})

export const CreateCategoryMutation = mutationField('CreateCategory', {
  type: CategoryNexus,
  args: {
    input: nonNull(arg({
      type: CreateCategoryMutationInput
    }))
  },
  async resolve (_root, data, { prisma, currentUser }: AppServerContext) {
    if (!currentUser) throw new Error('Precisa de user')
    const categoryRepository = new PrismaCategoryRepository(prisma)
    const useCase = new CreateCategory(currentUser, categoryRepository)

    const result = await useCase.execute(data.input)
    if (result.isLeft()) throw result.value
    return result.value
  }
})
