import { join, basename } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createWriteStream, createReadStream } from 'node:fs';
import { access, stat, mkdir } from 'fs/promises';
import { Command } from '../command.js';

class CopyCommand extends Command {
  constructor(currentDir, source, destination) {
    super(currentDir);
    this.source = source;
    this.destination = destination;
  }

  async execute() {
    const sourcePath = join(this.currentDir, this.source);
    let destPath = join(this.currentDir, this.destination);

    try {
      const sourceStats = await stat(sourcePath);
      if (!sourceStats.isFile()) {
        throw new Error('Source is not a file');
      }

      const destStats = await stat(destPath).catch(() => null);

      if (destStats) {
        if (!destStats.isDirectory()) {
          throw new Error('Destination is not a directory');
        }
        destPath = join(destPath, basename(sourcePath));
      } else {
        await mkdir(destPath, { recursive: true });
      }

      await pipeline(
        createReadStream(sourcePath),
        createWriteStream(destPath)
      );

      return `File copied from ${this.source} to ${this.destination}`;
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`File or directory not found: ${err.path}`);
      }
      throw new Error(`Copy failed: ${err.message}`);
    }
  }
}

export { CopyCommand };
