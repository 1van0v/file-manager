import { Transform } from 'stream';
import { CustomError } from './errors/custom.error.js';
import { InvalidInputError } from './errors/invalid-input.error.js';

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
    const data = await handler(payload);

    if (Array.isArray(data)) {
      return console.table(data);
    }

    if (data) {
      this.push(data + '\n');
    }
  }
}
