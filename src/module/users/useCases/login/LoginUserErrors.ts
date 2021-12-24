export namespace LoginUserErrors {
  export class InvalidEmailOrPasswordError extends Error {
    constructor () {
      super('The received email or password is invalid')
      this.name = 'InvalidEmailOrPasswordError'
    }
  }
}
