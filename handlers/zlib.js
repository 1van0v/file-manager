import zlib from 'zlib';
import fs from 'fs';
import { pipeline } from 'stream/promises';

import { destinationResolver } from '../utils/destination-resolver.js';

export const compress = async ([src, dist]) => {
  const destFile = await destinationResolver(src, dist, 'br');
  await pipeline(
    fs.createReadStream(src),
    zlib.createBrotliCompress(),
    fs.createWriteStream(destFile)
  );
};

export const decompress = async ([src, dist]) => {
  const destFile = await destinationResolver(src.replace(/\.br$/, ''), dist);

  await pipeline(
    fs.createReadStream(src),
    zlib.createBrotliDecompress(),
    fs.createWriteStream(destFile)
  );
};
