import { dirname } from 'node:path';
import fs from 'node:fs/promises';
import { Command } from './command.js';

class UpCommand extends Command {
  async execute() {
    const parentDir = dirname(this.currentDir);

    try {
      await fs.access(parentDir);
      this.updateWorkingDir = parentDir;
      return `Moved up to directory: ${parentDir}`;
    } catch (error) {
      throw new Error('Cannot move up from root directory');
    }
  }
}

export { UpCommand };
