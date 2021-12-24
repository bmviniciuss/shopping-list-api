import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../tests/entities/factories/userFactory'
import { Hasher } from '../../../cryptography/protocols/Hash'
import { CreateUserRepoDTO, UserRepository } from '../../repos/UserRepository'
import { RegisterUser } from './RegisterUser'
import { RegisterUserDTO } from './RegisterUserDTO'
import { RegisterUserErrors } from './RegisterUserErrors'

function makeSut () {
  const userRepositoryMock = mock<UserRepository>()
  const hasherMock = mock<Hasher>()

  // success state mock
  userRepositoryMock.exists.mockResolvedValue(false)
  userRepositoryMock.create.mockResolvedValue(userFactory(1))

  const sut = new RegisterUser(userRepositoryMock, hasherMock)
  return { sut, userRepositoryMock, hasherMock }
}

function makeData (): RegisterUserDTO {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password,
    passwordConfirmation: password
  }
}

describe('RegisterUser', () => {
  let data: RegisterUserDTO

  beforeEach(() => {
    data = makeData()
  })

  it('should call UserRepository.exists with provided email', async () => {
    const { sut, userRepositoryMock } = makeSut()
    await sut.execute(data)
    expect(userRepositoryMock.exists).toHaveBeenCalledWith(data.email)
  })

  it('should return a RegisterUserErrors.EmailInUseError if users already exists', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.exists.mockResolvedValueOnce(true)
    const result = await sut.execute(makeData())
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new RegisterUserErrors.EmailInUseError())
  })

  it('should call Hasher.hash with provided password', async () => {
    const { sut, hasherMock } = makeSut()
    await sut.execute(data)
    expect(hasherMock.hash).toHaveBeenCalledWith(data.password)
  })

  it('should call Hasher.hash with provided password', async () => {
    const { sut, hasherMock } = makeSut()
    await sut.execute(data)
    expect(hasherMock.hash).toHaveBeenCalledWith(data.password)
  })

  it('should call UserRepository.create with correct params', async () => {
    const { sut, userRepositoryMock, hasherMock } = makeSut()
    const randomHash = faker.datatype.uuid()
    hasherMock.hash.mockResolvedValueOnce(randomHash)

    await sut.execute(data)
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      name: data.name,
      email: data.email,
      hashedPassword: randomHash
    } as CreateUserRepoDTO)
  })

  it('should return user on success', async () => {
    const { sut, userRepositoryMock } = makeSut()
    const { passwordConfirmation, ...userData } = data
    const user = userFactory(1, userData)
    userRepositoryMock.create.mockResolvedValueOnce(user)
    const result = await sut.execute(data)
    expect(result).toBeDefined()
    expect(user.name).toEqual(data.name)
  })
})
