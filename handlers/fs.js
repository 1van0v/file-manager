import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import os from 'os';
import { pipeline } from 'stream/promises';

import { destinationResolver } from '../utils/destination-resolver.js';
import { InvalidInputError } from '../errors/invalid-input.error.js';

export const up = () => process.chdir('..');

const getFileType = (dirent) => {
  if (dirent.isDirectory()) {
    return 'directory';
  } else if (dirent.isBlockDevice()) {
    return 'block device';
  } else if (dirent.isFIFO()) {
    return 'pipe';
  } else if (dirent.isCharacterDevice()) {
    return 'character device';
  } else if (dirent.isSocket()) {
    return 'socket';
  } else {
    return 'file';
  }
};

const sortByType = (aDirent, bDirent) => {
  if (aDirent.isDirectory()) {
    return bDirent.isDirectory() ? 0 : -1;
  } else {
    return 1;
  }
};

export const ls = async () => {
  const items = await fs.readdir(process.cwd(), { withFileTypes: true });

  return items.sort(sortByType).map((i) => ({ name: i.name, type: getFileType(i) }));
};

export const cd = ([path]) => {
  process.chdir(path.replace('~', os.userInfo().homedir));
};

export const cat = ([path]) => {
  if (!path) {
    throw new InvalidInputError();
  }

  return createReadStream(path);
};

export const add = async ([filename]) => {
  await fs.open(filename, 'wx');
};

export const rn = async ([oldName, newName]) => fs.rename(oldName, newName);

export const cp = async ([src, dist]) => {
  const destFile = await destinationResolver(src, dist);
  return pipeline(createReadStream(src), createWriteStream(destFile));
}

export const rm = async ([filename]) => fs.rm(filename);

export const mv = async (args) => {
  await cp(args);
  await fs.rm(args[0]);
};
