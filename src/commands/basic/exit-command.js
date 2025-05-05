import { Command } from '../command.js';

class ExitCommand extends Command {
  async execute() {
    return 'Exiting...';
  }
}

export { ExitCommand };
