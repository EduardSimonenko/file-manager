import { stdin } from 'node:process';
import { EventEmitter } from 'node:events';
import { CommandInvoker } from './lib/command-invoker.js';
import { CommandFactory } from './lib/command-factory.js';
import { ExitCommand } from './lib/commands/exit-command.js';

class FileManager {
  #commandInvoker;
  #systemInfoService;
  #userName;
  #currentDir;
  #eventEmitter;
  #commandFactory;

  constructor(userName) {
    this.#commandInvoker = new CommandInvoker();
    this.#userName = userName;
    this.#currentDir = process.cwd();
    this.#eventEmitter = new EventEmitter();
    this.#commandFactory = new CommandFactory(this.#currentDir);

    this.#setupEventListeners();
  }

  run() {
    this.#showWelcomeMessage();
    this.#showCurrentDirectory();
    this.#setupInputHandling();
  }

  #setupEventListeners() {
    this.#eventEmitter.on('commandSuccess', (result) => {
      console.log(result);
      this.#showCurrentDirectory();
    });

    this.#eventEmitter.on('commandError', (error) => {
      console.error('Operation failed:', error.message);
      this.#showCurrentDirectory();
    });

    this.#eventEmitter.on('invalidInput', () => {
      console.log('Invalid input');
      this.#showCurrentDirectory();
    });
  }

  #setupInputHandling() {
    stdin.setEncoding('utf8');

    stdin.on('data', async (data) => {
      try {
        const input = data.toString().trim();
        await this.#handleInput(input);
      } catch (error) {
        this.#eventEmitter.emit('commandError', error);
      }
    });

    stdin.on('error', (error) => {
      this.#eventEmitter.emit('commandError', error);
    });

    process.on('SIGINT', () => {
      this.#exitHandler();
    });
  }

  async #handleInput(input) {
    if (!input) return;

    try {
      const command = this.#commandFactory.createCommand(input);

      if (command instanceof ExitCommand) {
        this.#exitHandler();
        return;
      }

      this.#commandInvoker.setCommand(command);
      const result = await this.#commandInvoker.executeCommand();

      if (command.updateWorkingDir) {
        this.#currentDir = command.updateWorkingDir;
        this.#commandFactory.setCurrentDir(command.updateWorkingDir);
      }

      this.#eventEmitter.emit('commandSuccess', result); 
    } catch (error) {
      if (error.name === 'InvalidInputError') {
        this.#eventEmitter.emit('invalidInput');
      } else {
        this.#eventEmitter.emit('commandError', error);
      }
    }
  }

  #showWelcomeMessage() {
    console.log(`Welcome to the File Manager, ${this.#userName}!`);
  }

  #showCurrentDirectory() {
    console.log(`You are currently in ${this.#currentDir}`);
  }

  #exitHandler() {
    console.log(
      `Thank you for using File Manager, ${this.#userName}, goodbye!`);
    process.exit();
  }
}

function parseCliArgs(args) {
  return args.reduce((acc, arg) => {
    const [name, value] = arg.split('=');
    if (name && value) {
      acc[name.replace(/^--/, '')] = value;
    }
    return acc;
  }, {});
}

const args = parseCliArgs(process.argv.slice(2));
if (args.username) {
  const fileManager = new FileManager(args.username);
  fileManager.run();
} else {
  console.error('Username is required. Usage: --username=your_username');
  process.exit(1);
}

