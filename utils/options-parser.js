import { InvalidInputError } from '../errors/invalid-input.error.js';

export const optionsParser = (opts) =>
  opts.reduce((parsed, opt) => {
    if (!opt.startsWith('--')) {
      throw new InvalidInputError();
    }

    const [optName, optValue] = opt.slice(2).split('=');

    parsed[optName] = optValue

    return parsed;
  }, {});
