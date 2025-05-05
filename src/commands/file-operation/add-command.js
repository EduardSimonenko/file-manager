import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { Command } from '../command.js';

class AddCommand extends Command {
  constructor(currentDir, filePath) {
    super(currentDir);
    this.fileName = filePath;
  }

  async execute() {
    const fullPath = join(this.currentDir, this.fileName);

    try {
      await writeFile(fullPath, '', { 'flag': 'wx' });
      return `File created: ${this.fileName}`;
    } catch (error) {
      if (error.code === 'EEXIST') {
        throw new Error(`File already exists: ${this.fileName}`);
      }
      throw new Error(`Cannot create file: ${error.message}`);
    }
  }
}

export { AddCommand };
