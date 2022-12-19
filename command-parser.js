import { Transform } from 'stream';

export class CommandParser extends Transform {
  constructor(username) {
    super({ readableObjectMode: true });
    this.push({ type: 'init', payload: [username] });
  }
  _transform(chunk, encoding, next) {
    const [type, ...payload] = chunk.toString().split(' ');
    this.push({ type: type.trim(), payload });
    next();
  }
}
