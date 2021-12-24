import { User } from '.prisma/client'

import { Either, left, right } from '../../../../shared/core/Either'
import { UseCase } from '../../../../shared/core/UseCase'
import { Hasher } from '../../../cryptography/protocols/Hash'
import { UserRepository } from '../../repos/UserRepository'
import { RegisterUserDTO } from './RegisterUserDTO'
import { RegisterUserErrors } from './RegisterUserErrors'

type RegisterUserResult = Either<RegisterUserErrors.EmailInUseError, User>

export class RegisterUser implements UseCase<RegisterUserDTO, RegisterUserResult> {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher
  ) {}

  async execute (input: RegisterUserDTO): Promise<RegisterUserResult> {
    const { email, password, name } = input
    const userExists = await this.userRepository.exists(email)

    if (userExists) {
      return left(new RegisterUserErrors.EmailInUseError())
    }

    const hashedPassword = await this.hasher.hash(password)

    const user = await this.userRepository.create({
      name,
      email,
      hashedPassword
    })

    return right(user)
  }
}
