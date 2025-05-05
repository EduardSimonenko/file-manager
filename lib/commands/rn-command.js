import { join, dirname } from 'node:path';
import { rename } from 'node:fs/promises';
import { Command } from './command.js';

class RnCommand extends Command {
  constructor(currentDir, filePath, newName) {
    super(currentDir);
    this.filePath = filePath;
    this.newName = newName;
  }

  async execute() {
    const oldPath = join(this.currentDir, this.filePath);
    const newPath = join(dirname(oldPath), this.newName);

    try {
      await rename(oldPath, newPath);
      return `Renamed from ${oldPath} to ${newPath}`;
    } catch (error) {
      throw new Error(`Cannot rename file: ${error.message}`);
    }
  }
}

export { RnCommand };
