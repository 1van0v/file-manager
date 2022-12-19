import { Transform } from 'stream';

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
    let actionResult;

    if (type in handlersMap) {
      actionResult = handlersMap[type](payload);
    } else {
      actionResult = 'Invalid input';
    }

    this.push(actionResult + '\n');
  }

  showPrompt() {
    this.push('\n' + 'You are currently in ' + process.cwd() + '\n'.repeat(2));
  }
}
