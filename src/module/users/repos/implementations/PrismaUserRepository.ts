import { PrismaClient, User } from '.prisma/client'

import { CreateUserRepoDTO, UserRepository } from '../UserRepository'

export class PrismaUserRepository implements UserRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async exists (email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) return false
    return true
  }

  async create (data: CreateUserRepoDTO): Promise<User> {
    throw new Error('Not implemented')
  }
}
