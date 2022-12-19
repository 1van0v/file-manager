import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import os from 'os';
import { pipeline } from 'stream/promises';

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

  return items
    .sort(sortByType)
    .map((i) => ({ name: i.name, type: getFileType(i) }));
};

export const cd = ([path]) => {
  process.chdir(path.replace('~', os.userInfo().homedir));
};

export const cat = ([path]) => createReadStream(path);

export const add = async ([filename]) => fs.open(filename, 'wx');

export const rn = async ([oldName, newName]) => fs.rename(oldName, newName);

export const cp = ([src, dist]) => pipeline(createReadStream(src), createWriteStream(dist));

export const mv = async (args) => {
  await cp(args);
  fs.rm(args[0]);
};

export const rm = async ([filename]) => fs.rm(filename);
