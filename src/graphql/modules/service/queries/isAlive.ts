import { queryField } from 'nexus'

export const okQuery = queryField('isAlive', {
  type: 'Boolean',
  resolve () {
    return true
  }
})
