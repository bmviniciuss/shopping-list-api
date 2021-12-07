import { User } from '.prisma/client'

import factoryMaker, { DeepPartial } from 'factory-maker'
import faker from 'faker'

function makeUser (options?: DeepPartial<User>):User {
  const baseUser: User = {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: faker.datatype.uuid(),
    accessToken: null,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  return Object.assign({}, baseUser, options)
}

export default factoryMaker<User>(makeUser)
