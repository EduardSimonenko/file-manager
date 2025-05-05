import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress, constants as zlibConstants } from 'node:zlib';
import { join, basename, relative } from 'node:path';
import { Command } from '../command.js';

class CompressCommand extends Command {
  constructor(currentDir, sourcePath, destPath) {
    super(currentDir);
    this.sourcePath = sourcePath;
    this.destPath = destPath;
  }

  async execute() {
    const fullSourcePath = join(this.currentDir, this.sourcePath);
    let fullDestPath = join(this.currentDir, this.destPath);

    try {
      const stats = await stat(fullSourcePath);
      if (!stats.isFile()) throw new Error('Source is not a file');

      try {
        const destStats = await stat(fullDestPath);
        if (destStats.isDirectory()) {
          fullDestPath = join(fullDestPath, `${basename(this.sourcePath)}.br`);
        }
      } catch {
        if (fullDestPath.endsWith('/') || !fullDestPath.endsWith('.br')) {
          fullDestPath += '.br';
        }
      }

      const compressStream = createBrotliCompress({
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]: 6
        }
      });

      await pipeline(
        createReadStream(fullSourcePath),
        compressStream,
        createWriteStream(fullDestPath)
      );

      return `Successfully compressed: ${this.sourcePath} → ${relative(this.currentDir, fullDestPath)}`;
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`File not found: ${err.path === fullSourcePath ? this.sourcePath : this.destPath}`);
      }
      throw new Error(`Compression failed: ${err.message}`);
    }
  }
}

export { CompressCommand };