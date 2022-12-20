import zlib from 'zlib';
import fs from 'fs';
import { pipeline } from 'stream/promises';

export const compress = ([src, dist]) => pipeline(
  fs.createReadStream(src),
  zlib.createBrotliCompress(),
  fs.createWriteStream(dist)
);


export const decompress = ([src, dist]) => pipeline(
  fs.createReadStream(src),
  zlib.createBrotliDecompress(),
  fs.createWriteStream(dist)
)