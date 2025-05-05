import { join, basename } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createWriteStream, createReadStream } from 'node:fs';
import { unlink, stat, mkdir } from 'fs/promises';
import { Command } from './command.js';

class MvCommand extends Command {
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
        if (destStats.isDirectory()) {
          destPath = join(destPath, basename(sourcePath));
        }
      } else {
        const destDir = destPath.endsWith('/') ? destPath : path.dirname(destPath);
        await mkdir(destDir, { recursive: true });
      }

      await pipeline(
        createReadStream(sourcePath),
        createWriteStream(destPath)
      );

      await unlink(sourcePath);

      return `File moved from ${this.source} to ${this.destination}`;
    } catch (err) {
      await unlink(destPath).catch(() => {});
      throw new Error(`Move failed: ${err.message}`);
    }
  }
}

export { MvCommand };
