import { PrismaClient } from '.prisma/client'

import faker from 'faker'

import userFactory from '../../../../../tests/entities/factories/userFactory'
import { CreateUserRepoDTO } from '../UserRepository'
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

  describe('create', () => {
    let createUserData: CreateUserRepoDTO
    beforeEach(() => {
      createUserData = {
        email: faker.internet.email(),
        name: faker.name.findName(),
        hashedPassword: faker.datatype.uuid()
      }
    })

    it('should create and return new user', async () => {
      const user = await prismaUserRepository.create(createUserData)
      expect(user).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.name).toEqual(createUserData.name)
      expect(user.password).toEqual(createUserData.hashedPassword)
      expect(user.email).toEqual(createUserData.email)
    })

    it('should throw an error if user with same email is created', async () => {
      await prismaUserRepository.create(createUserData)
      await expect(prismaUserRepository.create(createUserData)).rejects.toThrow()
    })
  })

  describe('loadByEmail', () => {
    it('should return existing user', async () => {
      const user = await prisma.user.create({ data: userFactory(1) })
      const result = await prismaUserRepository.loadByEmail(user.email)
      expect(result).toBeDefined()
      expect(result!.id).toEqual(user.id)
    })

    it('should return null if user does not exists', async () => {
      const result = await prismaUserRepository.loadByEmail(faker.internet.email())
      expect(result).toEqual(null)
    })
  })

  describe('login', () => {
    it("should set users' accessToken", async () => {
      const user = await prisma.user.create({ data: userFactory(1) })
      const accessToken = faker.datatype.uuid()
      const result = await prismaUserRepository.loginUser(user.id, accessToken)

      expect(result).toBeDefined()
      if (result) {
        expect(result!.id).toEqual(user.id)
        expect(result!.accessToken).toEqual(accessToken)
      }
    })
  })
})
