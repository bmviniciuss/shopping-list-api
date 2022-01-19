import { Category, User } from '@prisma/client'

export type CreateCategoryRepositoryDTO = {
  name: string
  description?: string | null | undefined
}

export interface CategoryRepository {
  create(data: CreateCategoryRepositoryDTO, userId: User['id']): Promise<Category>
}
