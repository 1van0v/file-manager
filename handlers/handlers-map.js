import { exitHandler } from './exit.js';
import { initHandler } from './init.js';
import { osHandler } from './os.js';
import * as fsHandlers from './fs.js';
import * as zlibHandlers from './zlib.js';
import * as cryptoHandlers from './crypto.js';

export const handlersMap = {
  init: initHandler,
  os: osHandler,
  '.exit': exitHandler,
  ...fsHandlers,
  ...zlibHandlers,
  ...cryptoHandlers,
};
