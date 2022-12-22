import { Readable, Transform } from 'stream';

import { CustomError } from './errors/custom.error.js';
import { InvalidInputError } from './errors/invalid-input.error.js';
import { OperationFailedError } from './errors/operation-failed.error.js';

import { handlersMap } from './handlers/handlers-map.js';

export class CommandHandler extends Transform {
  constructor() {
    super({ writableObjectMode: true });
  }
  _transform(action, encoding, next) {
    this.handle(action, next);
  }

  async handle({ type, payload }, next) {
    const handler = handlersMap[type];

    try {
      this.checkHandler(handler);
      await this.runHandler(handler, payload);
    } catch (e) {
      if (e instanceof CustomError) {
        this.push(e.message + '\n');
      } else {
        console.error(e);
      }
    }

    this.showPrompt();
    next();
  }

  showPrompt() {
    this.push('\n' + 'You are currently in ' + process.cwd() + '\n'.repeat(2));
  }

  checkHandler(handler) {
    if (!handler) {
      throw new InvalidInputError();
    }
  }

  async runHandler(handler, payload) {
    let data;

    try {
      data = await handler(payload);
    } catch (e) {
      const error = e instanceof CustomError ? e : new OperationFailedError();

      throw error;
    }

    if (data instanceof Readable) {
      return this.readStream(data);
    }

    if (Array.isArray(data)) {
      return console.table(data);
    }

    if (data) {
      this.push(data + '\n');
    }
  }

  readStream = (readStream) => {
    return new Promise((resolve, reject) => {
      readStream.on('data', (data) => this.push(data));
      readStream.on('end', () => resolve());
      readStream.on('error', () => reject(new OperationFailedError()));
    });
  };
}
