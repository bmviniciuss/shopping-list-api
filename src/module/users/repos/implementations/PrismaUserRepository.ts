import { PrismaClient, User } from '.prisma/client'

import { CreateUserRepoDTO, UserRepository } from '../UserRepository'

export class PrismaUserRepository implements UserRepository {
  constructor (private readonly prisma: PrismaClient) {}

  exists (email: string): Promise<boolean> {
    return this.prisma.user.findUnique({
      where: {
        email: email
      }
    }).then(user => !!user)
  }

  async create (data: CreateUserRepoDTO): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.hashedPassword
      }
    })
  }

  loadByEmail (email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  loginUser (userId: User['id'], accessToken: string): Promise<User> {
    return this.prisma.user.update(
      {
        where: { id: userId },
        data: {
          accessToken
        }
      }
    )
  }
}
