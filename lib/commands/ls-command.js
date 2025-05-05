import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from './command.js';

class LsCommand extends Command {
  async execute() {
    try {
      const files = await fs.readdir(this.currentDir, { 'withFileTypes': true });

      const directories = files
        .filter(file => file.isDirectory())
        .map(dir => ({ name: dir.name, type: 'directory' }));

      const fileList = files
        .filter(file => file.isFile())
        .map(file => ({ name: file.name, type: 'file' }));

      const sorted = [...directories.sort(), ...fileList.sort()];

      console.table(sorted);
      return '';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export { LsCommand };
