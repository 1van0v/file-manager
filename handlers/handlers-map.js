import { exitHandler } from './exit.js';
import { initHandler } from './init.js';

export const handlersMap = {
  init: initHandler,
  '.exit': exitHandler,
};
