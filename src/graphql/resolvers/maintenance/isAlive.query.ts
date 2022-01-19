import { builder } from '../../builder'

export const isAliveQuery = builder.queryField('isAlive', (t) => {
  return t.boolean({
    resolve () {
      return true
    }
  })
})
