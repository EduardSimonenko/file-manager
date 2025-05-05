import { join } from 'node:path';
import { createReadStream } from 'node:fs';
import { Command } from './command.js';

class CatCommand extends Command {
  constructor(currentDir, filePath) {
    super(currentDir);
    this.filePath = filePath;
  }

  async execute() {
    const fullPath = join(this.currentDir, this.filePath);

    return new Promise((resolve, reject) => {
      const readStream = createReadStream(fullPath, { 'encoding': 'utf8' });

      readStream.on('data', (chunk) => {
        process.stdout.write(chunk);
      });

      readStream.on('end', () => {
        resolve('\nFile reading completed');
      });

      readStream.on('error', (err) => {
        reject(new Error(`Cannot read file: ${err.message}`));
      });
    });
  }
}

export { CatCommand };
