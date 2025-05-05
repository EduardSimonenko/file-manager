import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { Command } from '../command.js';

class MkdirCommand extends Command {
  constructor(currentDir, folderName) {
    super(currentDir);
    this.folderName = folderName;
  }

  async execute() {
    const fullPath = join(this.currentDir, this.folderName);

    try {
      await mkdir(fullPath);
      return `Folder created: ${this.folderName}`;
    } catch (error) {
      if (error.code === 'EEXIST') {
        throw new Error(`Folder already exists: ${this.folderName}`);
      }
      throw new Error(`Cannot create folder: ${error.message}`);
    }
  }
}

export { MkdirCommand };
