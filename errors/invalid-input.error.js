import { CustomError } from './custom.error.js'

export class InvalidInputError extends CustomError {
  constructor() {
    super('Invalid input');
  }
}
