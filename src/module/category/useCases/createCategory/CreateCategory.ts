import { Category, User } from '@prisma/client'

import { Either, right } from '../../../../shared/core/Either'
import { UseCase } from '../../../../shared/core/UseCase'
import { CategoryRepository } from '../../repos/CategoryRepository'
import { CreateCategoryDTO } from './CreateCategoryDTO'

type CreateCategoryResult = Either<undefined, Category>

export class CreateCategory implements UseCase<CreateCategoryDTO, CreateCategoryResult> {
  constructor (
    private readonly currentUser: User,
    private readonly categoryRepository: CategoryRepository) {}

  async execute (input: CreateCategoryDTO): Promise<CreateCategoryResult> {
    const category = await this.categoryRepository.create(input, this.currentUser.id)
    return right(category)
  }
}
