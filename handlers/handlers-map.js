import { exitHandler } from './exit.js';
import { initHandler } from './init.js';
import { osHandler } from './os.js';
import * as fsHandlers from './fs.js';

export const handlersMap = {
  init: initHandler,
  os: osHandler,
  '.exit': exitHandler,
  ...fsHandlers,
};
