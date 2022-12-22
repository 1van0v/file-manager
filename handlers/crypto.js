import crypto from 'crypto';
import fs from 'fs';

export const hash = ([filename]) =>
  new Promise((resolve, reject) => {
    const input = fs.createReadStream(filename);
    const hashMachine = crypto.createHash('sha256');

    input.on('readable', () => {
      const chunk = input.read();

      if (chunk) {
        hashMachine.update(chunk);
      } else {
        resolve(hashMachine.digest('hex'));
      }
    });

    input.on('error', reject);
  });
