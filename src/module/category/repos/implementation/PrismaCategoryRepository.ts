import { Category, PrismaClient, User } from '@prisma/client'

import { CategoryRepository, CreateCategoryRepositoryDTO } from '../CategoryRepository'

export class PrismaCategoryRepository implements CategoryRepository {
  constructor (private readonly prisma: PrismaClient) {}

  create (data: CreateCategoryRepositoryDTO, userId: User['id']): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description || '',
        createdBy: {
          connect: {
            id: userId
          }
        }
      }
    })
  }
}
