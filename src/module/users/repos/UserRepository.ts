import { User } from '.prisma/client'

export type CreateUserRepoDTO = {
  name: string
  email: string
  hashedPassword: string
}

export interface UserRepository {
  exists: (email: string) => Promise<boolean>
  create: (data: CreateUserRepoDTO) => Promise<User>
  loadByEmail: (email: string) => Promise<User|null>
  loginUser: (accessToken: string) => Promise<User>
}
