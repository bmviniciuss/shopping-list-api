import { User } from '.prisma/client'

import { Either, left, right } from '../../../../shared/core/Either'
import { UseCase } from '../../../../shared/core/UseCase'
import { LoginUserDTO } from './LoginUserDTO'
import { UserRepository } from '../../repos/UserRepository'
import { LoginUserErrors } from './LoginUserErrors'
import { HashComparer } from '../../../cryptography/protocols/Hash'
import { Encrypter } from '../../../cryptography/protocols/jwt'

type LoginUserSuccessResult = {
  user: User
  accessToken: string
}

type LoginUserResult = Either<LoginUserErrors.InvalidEmailOrPasswordError, LoginUserSuccessResult>

export class LoginUser implements UseCase<LoginUserDTO, LoginUserResult> {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {
  }

  async execute (input: LoginUserDTO): Promise<LoginUserResult> {
    const user = await this.userRepository.loadByEmail(input.email)
    if (!user) return left(new LoginUserErrors.InvalidEmailOrPasswordError())
    if (!user.active) return left(new LoginUserErrors.InvalidEmailOrPasswordError())

    const passwordsMatches = await this.hashComparer.compare(input.password, user.password)

    if (!passwordsMatches) return left(new LoginUserErrors.InvalidEmailOrPasswordError())
    const accessToken = await this.encrypter.encrypt(user.id)
    const loggedUser = await this.userRepository.loginUser(user.id, accessToken)
    return right({
      user: loggedUser,
      accessToken
    })
  }
}
