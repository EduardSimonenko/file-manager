import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';
import { Command } from '../command.js';

class HashCommand extends Command {
  constructor(currentDir, filePath) {
    super(currentDir);
    this.filePath = filePath;
  }

  async execute() {
    const fullPath = join(this.currentDir, this.filePath);
    const hash = createHash('sha256');

    try {
      await pipeline(
        createReadStream(fullPath),
        hash,
      );

      const fileHash = hash.digest('hex');
      return `Hash (SHA-256) for ${this.filePath}: ${fileHash}`;
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`File not found: ${this.filePath}`);
      }
      throw new Error(`Hash calculation failed: ${err.message}`);
    }
  }
}

export { HashCommand };