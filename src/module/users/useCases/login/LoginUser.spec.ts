import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../tests/entities/factories/userFactory'
import { HashComparer } from '../../../cryptography/protocols/Hash'
import { Encrypter } from '../../../cryptography/protocols/jwt'
import { UserRepository } from '../../repos/UserRepository'
import { LoginUser } from './LoginUser'
import { LoginUserDTO } from './LoginUserDTO'
import { LoginUserErrors } from './LoginUserErrors'

function makeSut () {
  const userFromLoadEmail = userFactory(1)
  const accessTokenMock = faker.datatype.uuid()

  const userRepositoryMock = mock<UserRepository>()
  const hashComparerMock = mock<HashComparer>()
  const encrypterMock = mock<Encrypter>()

  userRepositoryMock.loadByEmail.mockResolvedValue(userFromLoadEmail)
  userRepositoryMock.loginUser.mockResolvedValue({ ...userFromLoadEmail, accessToken: accessTokenMock })
  hashComparerMock.compare.mockResolvedValue(true)
  encrypterMock.encrypt.mockResolvedValue(accessTokenMock)

  const sut = new LoginUser(userRepositoryMock, hashComparerMock, encrypterMock)
  return {
    sut,
    userRepositoryMock,
    hashComparerMock,
    encrypterMock,
    userFromLoadEmail,
    accessTokenMock
  }
}

const makeParams = (): LoginUserDTO => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

describe('LoginUser', () => {
  let params: LoginUserDTO

  beforeEach(() => {
    params = makeParams()
  })

  it('should load user by provided email', async () => {
    const {
      sut,
      userRepositoryMock
    } = makeSut()
    await sut.execute(params)
    expect(userRepositoryMock.loadByEmail).toHaveBeenCalledWith(params.email)
  })

  it('should return a InvalidEmailOrPasswordError if user does not exits', async () => {
    const {
      sut,
      userRepositoryMock
    } = makeSut()
    userRepositoryMock.loadByEmail.mockResolvedValueOnce(null)
    const result = await sut.execute(params)
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new LoginUserErrors.InvalidEmailOrPasswordError())
  })

  it('should return a InvalidEmailOrPasswordError if user is not active', async () => {
    const {
      sut,
      userRepositoryMock
    } = makeSut()
    userRepositoryMock.loadByEmail.mockResolvedValueOnce(userFactory(1, {
      active: false
    }))
    const result = await sut.execute(params)
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new LoginUserErrors.InvalidEmailOrPasswordError())
  })

  it('should call compare with correct params', async () => {
    const {
      sut,
      hashComparerMock,
      userFromLoadEmail
    } = makeSut()

    await sut.execute(params)
    expect(hashComparerMock.compare).toHaveBeenCalledWith(params.password, userFromLoadEmail.password)
  })

  it('should return a InvalidEmailOrPasswordError if passwords doesnt match', async () => {
    const {
      sut,
      hashComparerMock
    } = makeSut()
    hashComparerMock.compare.mockResolvedValueOnce(false)

    const result = await sut.execute(params)
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new LoginUserErrors.InvalidEmailOrPasswordError())
  })

  it('should call encrypter with correct value', async () => {
    const {
      sut,
      encrypterMock,
      userFromLoadEmail
    } = makeSut()

    await sut.execute(params)
    expect(encrypterMock.encrypt).toHaveBeenCalledWith(userFromLoadEmail.id)
  })

  it('should call login with correct values', async () => {
    const {
      sut,
      accessTokenMock,
      userRepositoryMock,
      userFromLoadEmail
    } = makeSut()

    await sut.execute(params)
    expect(userRepositoryMock.loginUser).toHaveBeenCalledWith(userFromLoadEmail.id, accessTokenMock)
  })

  it('should return user and accessToken on success', async () => {
    const { sut, accessTokenMock, userFromLoadEmail } = makeSut()

    const result = await sut.execute(params)

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      const { user, accessToken } = result.value
      expect(user.id).toEqual(userFromLoadEmail.id)
      expect(accessToken).toEqual(accessTokenMock)
    }
  })
})
