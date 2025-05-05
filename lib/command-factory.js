import { UpCommand } from './commands/up-command.js';
import { ExitCommand } from './commands/exit-command.js';
import { CdCommand } from './commands/cd-command.js';
import { LsCommand } from './commands/ls-command.js';
import { InvalidInputError } from './invalid-input-error.js';

class CommandFactory {
  #currentDir;

  constructor(currentDir) {
    this.#currentDir = currentDir;
  }

  createCommand(input) {
    const [commandName, ...args] = input.trim().split(' ');

    switch (commandName) {
      case 'up':
        return new UpCommand(this.#currentDir);
      case 'cd':
        if (!args[0]) throw new InvalidInputError('Path is required for cd command');
        return new CdCommand(this.#currentDir, args[0]);
      case 'ls':
        return new LsCommand(this.#currentDir);
      case '.exit':
        return new ExitCommand();
      default:
        throw new Error('Unknown command');
    }
  }

  setCurrentDir(path) {
    this.#currentDir = path;
  }
}

export { CommandFactory };