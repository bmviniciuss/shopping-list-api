import { PrismaClient } from '.prisma/client'

import faker from 'faker'

import userFactory from '../../../../../tests/entities/factories/userFactory'
import { PrismaUserRepository } from './PrismaUserRepository'

describe('PrismaUserRepository', () => {
  let prisma: PrismaClient
  let prismaUserRepository: PrismaUserRepository

  beforeAll(() => {
    prisma = new PrismaClient()
    prismaUserRepository = new PrismaUserRepository(prisma)
  })

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany()

    await prisma.$transaction([
      deleteUsers
    ])

    await prisma.$disconnect()
  })

  describe('exists', () => {
    it('should return false if user does not exits', async () => {
      const email = faker.internet.email()
      const user = await prismaUserRepository.exists(email)
      expect(user).toEqual(false)
    })

    it('should return true if user does exits', async () => {
      const fakeUser = await prisma.user.create({
        data: userFactory(1)
      })
      const email = fakeUser.email
      const user = await prismaUserRepository.exists(email)
      expect(user).toEqual(true)
    })
  })
})
