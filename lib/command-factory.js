import { UpCommand } from './commands/up-command.js';
import { ExitCommand } from './commands/exit-command.js';

class CommandFactory {
  #currentDir;

  constructor(currentDir) {
    this.#currentDir = currentDir;
  }

  createCommand(commandName) {
    switch (commandName) {
      case 'up':
        return new UpCommand(this.#currentDir);
      case '.exit':
        return new ExitCommand();
      default:
        throw new Error('Unknown command');
    }
  }
}

export { CommandFactory };