import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { Command } from '../command.js';

class RmCommand extends Command {
  constructor(currentDir, filePath) {
    super(currentDir);
    this.fileName = filePath;
  }

  async execute() {
    const fullPath = join(this.currentDir, this.fileName);

    try {
      await rm(fullPath);
      return `File deleted: ${this.fileName}`;
    } catch (error) {
      throw new Error(`Cannot delete file: ${error.message}`);
    }
  }
}

export { RmCommand };
