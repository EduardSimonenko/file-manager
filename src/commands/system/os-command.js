import os from 'node:os';
import { Command } from '../command.js';

class OsCommand extends Command {
  constructor(currentDir, flag) {
    super(currentDir);
    this.flag = flag;
  }

  async execute() {
    switch (this.flag) {
      case '--EOL':
        return this.#getEOL();
      case '--cpus':
        return this.#getCPUs();
      case '--homedir':
        return this.#getHomeDir();
      case '--username':
        return this.#getUsername();
      case '--architecture':
        return this.#getArchitecture();
      default:
        throw new Error('Invalid OS flag');
    }
  }

  #getEOL() {
    const eol = os.EOL === '\n' ? '\\n (Unix)' : '\\r\\n (Windows)';
    return `Default system End-Of-Line: ${eol}`;
  }

  #getCPUs() {
    const cpus = os.cpus();
    let result = `Overall amount of CPUs: ${cpus.length}\n`;

    cpus.forEach((cpu, index) => {
      const speedGHz = (cpu.speed / 1000).toFixed(2);
      result += `CPU ${index + 1}: ${cpu.model} @ ${speedGHz} GHz\n`;
    });

    return result.trim();
  }

  #getHomeDir() {
    return `Home directory: ${os.homedir()}`;
  }

  #getUsername() {
    return `System user name: ${os.userInfo().username}`;
  }

  #getArchitecture() {
    return `CPU architecture: ${os.arch()}`;
  }
}

export { OsCommand };
