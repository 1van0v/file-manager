import os from 'os';

import { InvalidInputError } from '../errors/invalid-input.error.js';
import { optionsParser } from '../utils/options-parser.js';

const osInfoGetter = {
  EOL: () => JSON.stringify(os.EOL),
  cpus: () =>
    JSON.stringify(
      os.cpus().map(({ model, speed }) => ({ model, speed })),
      null,
      2
    ),
  homedir: () => os.homedir(),
  username: () => os.userInfo().username,
  architecture: () => os.arch(),
};

export const osHandler = (opts) => {
  let [opt] = Object.keys(optionsParser(opts));

  opt = opt.trim();

  if (opt in osInfoGetter) {
    return osInfoGetter[opt]();
  }

  throw new InvalidInputError();
};
