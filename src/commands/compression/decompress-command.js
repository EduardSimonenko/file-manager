import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { createBrotliDecompress } from 'node:zlib';
import { join, basename, relative } from 'node:path';
import { Command } from '../command.js';

class DecompressCommand extends Command {
  constructor(currentDir, sourcePath, destPath) {
    super(currentDir);
    this.sourcePath = sourcePath;
    this.destPath = destPath;
  }

  async execute() {
    const fullSourcePath = join(this.currentDir, this.sourcePath);
    let fullDestPath = join(this.currentDir, this.destPath);

    try {
      const sourceStats = await stat(fullSourcePath);
      if (!sourceStats.isFile()) throw new Error('Source is not a file');

      try {
        const destStats = await stat(fullDestPath);
        if (destStats.isDirectory()) {
          const originalName = basename(this.sourcePath).replace(/\.br$/, '');
          fullDestPath = join(fullDestPath, originalName);
        }
      } catch {
        if (fullDestPath.endsWith('/')) {
          fullDestPath = join(fullDestPath,
            basename(this.sourcePath).replace(/\.br$/, ''));
        }
      }

      await pipeline(
        createReadStream(fullSourcePath),
        createBrotliDecompress(),
        createWriteStream(fullDestPath),
      );

      return `Successfully decompressed: ${this.sourcePath} → ${relative(
        this.currentDir, fullDestPath)}`;
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`File not found: ${err.path === fullSourcePath
          ? this.sourcePath
          : this.destPath}`);
      }

      throw new Error(`Decompression failed: ${err.message}`);
    }
  }
}

export { DecompressCommand };