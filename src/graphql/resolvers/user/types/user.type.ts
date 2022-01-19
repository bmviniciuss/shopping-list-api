import { User } from '@prisma/client'

import { builder } from '../../../builder'

export const UserObject = builder.objectRef<User>('User').implement({
  description: 'A user from the system',
  fields: (t) => ({
    id: t.exposeID('id', {
      nullable: false
    }),
    email: t.exposeString('email', {
      nullable: false
    }),
    name: t.exposeString('name', {
      nullable: false
    }),
    active: t.exposeBoolean('active')
  })
})
