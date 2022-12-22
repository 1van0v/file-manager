import { CustomError } from './custom.error.js';

export class OperationFailedError extends CustomError {
  constructor() {
    super('Operation failed');
  }
}
