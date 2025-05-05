import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from './command.js';

class CdCommand extends Command {
  constructor(currentDir, targetPath) {
    super(currentDir);
    this.targetPath = targetPath.replace(/\\/g, '/');this.targetPath = targetPath;
  }

  async execute() {
    if (!this.targetPath) {
      throw new Error('Path is required for cd command');
    }

    const rootDir = path.parse(this.currentDir).root;

    let newPath;
    if (path.isAbsolute(this.targetPath)) {
      newPath = path.normalize(this.targetPath);
    } else {
      newPath = path.normalize(path.join(this.currentDir, this.targetPath));
    }

    if (!newPath.startsWith(rootDir)) {
      throw new Error(`Cannot move outside root directory (${rootDir})`);
    }

    try {
      const stats = await fs.stat(newPath);
      if (!stats.isDirectory()) {
        throw new Error('Target path is not a directory');
      }

      this.updateWorkingDir = newPath;
      return `Changed directory to: ${newPath}`;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Directory not found: ${this.targetPath}`);
      }
      throw error;
    }
  }
}

export { CdCommand };
