import process from 'process';
import os from 'os';

import { InvalidInputError } from '../errors/invalid-input.error.js';

export const initHandler = ([user]) => {
  if (!user) {
    throw new InvalidInputError();
  }

  process.chdir(os.homedir());

  return 'Welcome to the File Manager, ' + user.trim() + '!';
};
