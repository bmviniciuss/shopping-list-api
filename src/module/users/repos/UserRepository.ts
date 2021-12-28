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
  loginUser: (userId: User['id'], accessToken: string) => Promise<User>
  loadById: (id: string) => Promise<User | null>
}
