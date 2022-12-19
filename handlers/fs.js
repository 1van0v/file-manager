import fs from 'fs/promises';
import os from 'os';

import { OperationFailedError } from '../errors/operation-failed.error.js';

export const up = () => process.chdir('..');

export const ls = async () => {
  const items = await fs.readdir(process.cwd(), { withFileTypes: true });

  return items
    .sort((a, b) => {
      if (a.isDirectory()) {
        return b.isDirectory() ? 0 : -1;
      } else {
        return 1;
      }
    })
    .map((i) => {
      const name = i.name;
      let type = 'file';

      if (i.isDirectory()) {
        type = 'directory';
      } else if (i.isBlockDevice()) {
        type = 'block device';
      } else if (i.isFIFO()) {
        type = 'pipe';
      } else if (i.isCharacterDevice()) {
        type = 'character device';
      } else if (i.isSocket()) {
        type = 'socket';
      }

      return { name, type };
    });
};

export const cd = ([path]) => {
  try {
    process.chdir(path.trim().replace('~', os.userInfo().homedir));
  } catch {
    throw new OperationFailedError();
  }
};
