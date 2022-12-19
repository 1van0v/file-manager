import { Transform } from 'stream';
import { CustomError } from './errors/custom.error.js';
import { InvalidInputError } from './errors/invalid-input.error.js';

import { handlersMap } from './handlers/handlers-map.js';

export class CommandHandler extends Transform {
  constructor() {
    super({ writableObjectMode: true });
  }
  _transform(action, encoding, next) {
    this.handle(action);
    this.showPrompt();
    next();
  }

  handle({ type, payload }) {
    const handler = handlersMap[type];

    try {
      if (!handler) {
        throw new InvalidInputError();
      }

      this.push(handler(payload) + '\n');
    } catch (e) {
      if (e instanceof CustomError) {
        this.push(e.message + '\n');
      } else {
        console.error(e);
      }
    }
  }

  showPrompt() {
    this.push('\n' + 'You are currently in ' + process.cwd() + '\n'.repeat(2));
  }
}
