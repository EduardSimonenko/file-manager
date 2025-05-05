import { UpCommand } from './commands/up-command.js';
import { ExitCommand } from './commands/exit-command.js';
import { CdCommand } from './commands/cd-command.js';
import { LsCommand } from './commands/ls-command.js';
import { CatCommand } from './commands/cat-command.js';
import { AddCommand } from './commands/add-command.js';
import { MkdirCommand } from './commands/mkdir-command.js';
import { RnCommand } from './commands/rn-command.js';
import { CopyCommand } from './commands/copy-command.js';
import { MvCommand } from './commands/mv-command.js';
import { RmCommand } from './commands/rm-command.js';
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
      case 'cat':
        if (!args[0]) throw new InvalidInputError('Path is required for cat command');
        return new CatCommand(this.#currentDir, args[0]);
      case 'add':
        if (!args[0]) throw new InvalidInputError('File name is required for add command');
        return new AddCommand(this.#currentDir, args[0]);
      case 'mkdir':
        if (!args[0]) throw new InvalidInputError('Directory name is required for mkdir command');
        return new MkdirCommand(this.#currentDir, args[0]);
      case 'rm':
        if (!args[0]) throw new InvalidInputError('File path is required for rm command');
        return new RmCommand(this.#currentDir, args[0]);
      case 'rn':
        if (!args[0] || !args[1]) throw new InvalidInputError('The command should look like this: rn path_to_file new_filename');
        return new RnCommand(this.#currentDir, args[0], args[1]);
      case 'cp':
        if (!args[0] || !args[1]) throw new InvalidInputError('The command should look like this: cp path_to_file path_to_new_directory');
        return new CopyCommand(this.#currentDir, args[0], args[1]);
      case 'mv':
        if (!args[0] || !args[1]) throw new InvalidInputError('The command should look like this: mv path_to_file path_to_new_directory');
        return new MvCommand(this.#currentDir, args[0], args[1]);
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