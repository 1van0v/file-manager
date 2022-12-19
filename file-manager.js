import { pipeline } from 'stream';

import { CommandHandler } from './command-handler.js';
import { CommandParser } from './command-parser.js';
import { InvalidInputError } from './errors/invalid-input.error.js';
import { optionsParser } from './utils/options-parser.js';

let { username } = optionsParser(process.argv.slice(2));

if (!username) {
  throw new InvalidInputError();
}

const commandHandler = new CommandHandler();
const commandParser = new CommandParser(username);

pipeline(process.stdin, commandParser, commandHandler, process.stdout, (e) => {
  if (e) {
    console.error('failed', e);
  }
});

process.on('SIGINT', () => process.exit(0));
process.on('exit', (e) => {
  process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!\n`);
  process.exit(0);
});
