import fs from 'fs/promises';
import path from 'path';

export const destinationResolver = async (src, dist, ext) => {
  let filename = dist;

  try {
    const stats = await fs.stat(dist);
    if (stats.isDirectory()) {
      filename = path.join(dist, src);
    }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  if (ext && !filename.endsWith(ext)) {
    filename += '.' + ext;
  }

  console.log('filename', filename)
  return filename;
};
